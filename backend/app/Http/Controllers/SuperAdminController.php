<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Plan;
use App\Models\User;
use App\Models\SessionRequest;
use App\Models\Subscription;
use App\Models\CreditTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    /**
     * Get platform analytics
     */
    public function analytics()
    {
        $totalTenants = Tenant::count();
        $totalUsers = User::where('role', '!=', 'super_admin')->count();
        $totalSessions = SessionRequest::count();
        
        // Calculate MRR from active subscriptions
        $mrr = Subscription::where('status', 'active')
            ->where('billing_cycle', 'monthly')
            ->sum('price');
        
        // Calculate ARR
        $arr = Subscription::where('status', 'active')
            ->sum('price') * 12;
        
        // Churn rate (tenants inactive in last 30 days / total)
        $churned = Tenant::where('is_active', false)->count();
        $churnRate = $totalTenants > 0 ? round(($churned / $totalTenants) * 100, 1) : 0;
        
        // Calculate LTV (average subscription revenue * average lifespan)
        $avgSubscriptionValue = Subscription::where('status', 'active')->avg('price') ?? 0;
        $ltv = $avgSubscriptionValue * 24; // 24 months average lifespan
        
        // Calculate CAC (total marketing costs / new customers)
        $totalCredits = CreditTransaction::sum('amount');
        $cac = $totalUsers > 0 ? round($totalCredits / $totalUsers, 2) : 0;
        
        return response()->json(['data' => [
            'total_tenants' => $totalTenants,
            'total_users' => $totalUsers,
            'total_sessions' => $totalSessions,
            'mrr' => (float) $mrr,
            'arr' => (float) $arr,
            'churn_rate' => $churnRate,
            'ltv' => (float) $ltv,
            'cac' => (float) $cac,
            'credits_total' => (float) $totalCredits,
        ]]);
    }

    /**
     * List all tenants with pagination
     */
    public function tenants(Request $request)
    {
        $search = $request->input('search', '');
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 15);
        
        $query = Tenant::query();
        
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('subdomain', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $tenants = $query->with(['plan'])->paginate($perPage, ['*'], 'page', $page);
        
        // Add user and session counts
        $tenants->getCollection()->transform(function ($tenant) {
            $tenant->users_count = User::where('tenant_id', $tenant->id)->count();
            $tenant->sessions_count = SessionRequest::whereIn('requester_id', function ($query) use ($tenant) {
                $query->select('id')->from('users')->where('tenant_id', $tenant->id);
            })->orWhereIn('teacher_id', function ($query) use ($tenant) {
                $query->select('id')->from('users')->where('tenant_id', $tenant->id);
            })->count();
            
            $tenant->plan = $tenant->subscription?->plan;
            $tenant->status = $tenant->is_active ? 'active' : 'suspended';
            
            return $tenant;
        });
        
        return response()->json([
            'data' => $tenants->items(),
            'current_page' => $tenants->currentPage(),
            'last_page' => $tenants->lastPage(),
            'per_page' => $tenants->perPage(),
            'total' => $tenants->total(),
        ]);
    }

    /**
     * Get single tenant details
     */
    public function getTenant($id)
    {
        $tenant = Tenant::with(['plan', 'subscriptions'])->find($id);
        
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }
        
        $tenant->users_count = User::where('tenant_id', $tenant->id)->count();
        $tenant->admins = User::where('tenant_id', $tenant->id)->where('role', 'admin')->get();
        
        return response()->json(['data' => $tenant]);
    }

    /**
     * Create a new tenant
     */
    public function createTenant(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:100|unique:tenants,subdomain',
            'admin_email' => 'required|email',
            'admin_name' => 'required|string|max:255',
            'plan_id' => 'nullable|exists:plans,id',
            'max_users' => 'nullable|integer|min:1',
        ]);
        
        $tenant = Tenant::create([
            'name' => $validated['name'],
            'subdomain' => $validated['subdomain'],
            'email' => $validated['admin_email'],
            'max_users' => $validated['max_users'] ?? 200,
            'is_active' => true,
        ]);
        
        // Create admin user
        $admin = User::create([
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'password' => bcrypt('Password123!'),
            'role' => 'tenant_admin',
            'tenant_id' => $tenant->id,
        ]);
        
        // Create subscription if plan_id provided
        if (!empty($validated['plan_id'])) {
            $plan = Plan::find($validated['plan_id']);
            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'price' => $plan->monthly_price,
                'billing_cycle' => 'monthly',
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addMonth(),
            ]);
        }
        
        return response()->json(['data' => $tenant, 'message' => 'Tenant created successfully'], 201);
    }

    /**
     * Update a tenant
     */
    public function updateTenant(Request $request, $id)
    {
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email',
            'max_users' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);
        
        $tenant->update($validated);
        
        return response()->json(['data' => $tenant, 'message' => 'Tenant updated successfully']);
    }

    /**
     * Suspend a tenant
     */
    public function suspendTenant($id)
    {
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }
        
        $tenant->update(['is_active' => false]);
        
        // Deactivate all users in this tenant
        User::where('tenant_id', $id)->update(['is_active' => false]);
        
        return response()->json(['message' => 'Tenant suspended successfully']);
    }

    /**
     * Activate a tenant
     */
    public function activateTenant($id)
    {
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }
        
        $tenant->update(['is_active' => true]);
        
        return response()->json(['message' => 'Tenant activated successfully']);
    }

    /**
     * Delete a tenant
     */
    public function deleteTenant($id)
    {
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }
        
        $tenant->delete();
        
        return response()->json(['message' => 'Tenant deleted successfully']);
    }

    /**
     * List all plans
     */
    public function plans()
    {
        $plans = Plan::where('is_active', true)->get();
        
        $plans = $plans->map(function ($plan) {
            $plan->price = $plan->price_monthly;
            $plan->max_users = $plan->max_users;
            $plan->published = $plan->is_active;
            
            // Decode features JSON
            $features = $plan->features;
            if (is_string($features)) {
                $features = json_decode($features, true);
            }
            $plan->features = is_array($features) ? array_keys(array_filter($features, fn($v) => $v !== false)) : [];
            
            $plan->tenants_count = Subscription::where('plan_id', $plan->id)->count();
            return $plan;
        });
        
        return response()->json(['data' => $plans]);
    }

    /**
     * Create a new plan
     */
    public function createPlan(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'max_users' => 'required|integer|min:-1',
            'features' => 'nullable|array',
            'published' => 'nullable|boolean',
        ]);
        
        $plan = Plan::create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'price_monthly' => $validated['price'],
            'price_yearly' => $validated['price'] * 10,
            'max_users' => $validated['max_users'],
            'features' => json_encode($validated['features'] ?? []),
            'is_active' => $validated['published'] ?? false,
        ]);
        
        return response()->json(['data' => $plan, 'message' => 'Plan created successfully'], 201);
    }

    /**
     * Update a plan
     */
    public function updatePlan(Request $request, $id)
    {
        $plan = Plan::find($id);
        
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'max_users' => 'sometimes|integer|min:-1',
            'features' => 'nullable|array',
            'published' => 'nullable|boolean',
        ]);
        
        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['price'])) $updateData['price_monthly'] = $validated['price'];
        if (isset($validated['max_users'])) $updateData['max_users'] = $validated['max_users'];
        if (isset($validated['features'])) $updateData['features'] = json_encode($validated['features']);
        if (isset($validated['published'])) $updateData['is_active'] = $validated['published'];
        
        $plan->update($updateData);
        
        return response()->json(['data' => $plan, 'message' => 'Plan updated successfully']);
    }

    /**
     * Publish a plan
     */
    public function publishPlan($id)
    {
        $plan = Plan::find($id);
        
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }
        
        $plan->update(['is_active' => true]);
        
        return response()->json(['message' => 'Plan published successfully']);
    }

    /**
     * Get revenue analytics
     */
    public function revenue()
    {
        // Monthly recurring revenue chart (last 6 months)
        $mrrChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('M');
            $revenue = Subscription::where('status', 'active')
                ->where('billing_cycle', 'monthly')
                ->whereMonth('created_at', now()->subMonths($i)->month)
                ->sum('price');
            
            $mrrChart[] = [
                'month' => $month,
                'value' => (float) $revenue,
            ];
        }
        
        // Sessions chart
        $sessionsChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('M');
            $sessions = SessionRequest::whereMonth('created_at', now()->subMonths($i)->month)->count();
            
            $sessionsChart[] = [
                'month' => $month,
                'count' => $sessions,
            ];
        }
        
        // Recent payments
        $payments = Subscription::with(['tenant', 'plan'])
            ->orderByDesc('created_at')
            ->take(10)
            ->get()
            ->map(function ($sub) {
                return [
                    'tenant' => ['name' => $sub->tenant?->name],
                    'amount' => $sub->price,
                    'plan' => $sub->plan?->name,
                    'date' => $sub->created_at->format('Y-m-d'),
                    'status' => $sub->status,
                ];
            });
        
        // Calculate totals
        $mrr = Subscription::where('status', 'active')->where('billing_cycle', 'monthly')->sum('price');
        $arr = $mrr * 12;
        $churnRate = Tenant::where('is_active', false)->count() / max(Tenant::count(), 1) * 100;
        $avgLtv = Subscription::where('status', 'active')->avg('price') * 24;
        $avgCac = CreditTransaction::sum('amount') / max(User::count(), 1);
        
        return response()->json(['data' => [
            'mrr' => (float) $mrr,
            'arr' => (float) $arr,
            'churn_rate' => round($churnRate, 1),
            'ltv' => (float) $avgLtv,
            'cac' => (float) $avgCac,
            'mrr_chart' => $mrrChart,
            'sessions_chart' => $sessionsChart,
            'payments' => $payments,
        ]]);
    }

    /**
     * Get support tickets with pagination
     */
    public function tickets(Request $request)
    {
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 15);
        $status = $request->input('status', '');
        
        $query = DB::table('support_tickets')
            ->leftJoin('tenants', 'support_tickets.tenant_id', '=', 'tenants.id')
            ->leftJoin('users', 'support_tickets.user_id', '=', 'users.id')
            ->select(
                'support_tickets.*',
                'tenants.name as tenant_name',
                'users.name as user_name',
                'users.email as user_email'
            );
        
        if ($status && $status !== 'resolved') {
            $query->where('support_tickets.status', $status);
        } elseif ($status === 'resolved') {
            $query->where('support_tickets.status', 'resolved');
        }
        
        $total = $query->count();
        $tickets = $query->orderByDesc('support_tickets.created_at')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();
        
        // Transform data for frontend
        $tickets = $tickets->map(function ($ticket) {
            return [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'message' => $ticket->message,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'tenant' => ['id' => $ticket->tenant_id, 'name' => $ticket->tenant_name],
                'user' => ['id' => $ticket->user_id, 'name' => $ticket->user_name, 'email' => $ticket->user_email],
                'created_at' => $ticket->created_at,
                'resolved_at' => $ticket->resolved_at,
            ];
        });
        
        return response()->json([
            'data' => $tickets,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total,
        ]);
    }

    /**
     * Resolve a support ticket
     */
    public function resolveTicket($id)
    {
        $ticket = DB::table('support_tickets')->where('id', $id)->first();
        
        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }
        
        DB::table('support_tickets')
            ->where('id', $id)
            ->update([
                'status' => 'resolved',
                'resolved_at' => now(),
                'updated_at' => now(),
            ]);
        
        return response()->json(['message' => 'Ticket resolved successfully']);
    }

    /**
     * Assign a ticket to an agent
     */
    public function assignTicket(Request $request, $id)
    {
        $validated = $request->validate([
            'agent_id' => 'required|exists:users,id',
        ]);
        
        $ticket = DB::table('support_tickets')->where('id', $id)->first();
        
        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }
        
        DB::table('support_tickets')
            ->where('id', $id)
            ->update([
                'assigned_to' => $validated['agent_id'],
                'status' => 'in_progress',
                'updated_at' => now(),
            ]);
        
        return response()->json(['message' => 'Ticket assigned successfully']);
    }

    /**
     * Get tenant usage statistics
     */
    public function tenantStats($id)
    {
        $tenant = Tenant::find($id);
        
        if (!$tenant) {
            return response()->json(['message' => 'Tenant not found'], 404);
        }
        
        $usersCount = User::where('tenant_id', $id)->count();
        $activeUsersCount = User::where('tenant_id', $id)->where('is_active', true)->count();
        
        $sessionsCount = SessionRequest::whereIn('requester_id', function ($query) use ($id) {
            $query->select('id')->from('users')->where('tenant_id', $id);
        })->orWhereIn('teacher_id', function ($query) use ($id) {
            $query->select('id')->from('users')->where('tenant_id', $id);
        })->count();
        
        $revenue = Subscription::where('tenant_id', $id)->where('status', 'active')->sum('price');
        
        return response()->json(['data' => [
            'tenant_id' => $id,
            'tenant_name' => $tenant->name,
            'users_count' => $usersCount,
            'active_users_count' => $activeUsersCount,
            'sessions_count' => $sessionsCount,
            'monthly_revenue' => (float) $revenue,
            'max_users' => $tenant->max_users,
            'subscription_status' => $tenant->subscription?->status,
            'plan' => $tenant->subscription?->plan?->name,
        ]]);
    }
}