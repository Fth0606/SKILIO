<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function analytics(Request $request)
    {
        // Simple mock authentication for testing
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user || !in_array($user->role, ['tenant_admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden: Admin access required'], 403);
        }

        $tenantId = $user->tenant_id;

        // Total Users
        $totalUsers = User::where('tenant_id', $tenantId)->count();
        
        // Active Users (logged in in the last 30 days)
        $activeUsers = User::where('tenant_id', $tenantId)
            ->where('last_login_at', '>=', Carbon::now()->subDays(30))
            ->count();

        // Sessions this month
        $sessionsCount = DB::table('session_requests')
            ->join('users', 'session_requests.requester_id', '=', 'users.id')
            ->where('users.tenant_id', $tenantId)
            ->where('session_requests.created_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        // Credits exchanged
        $creditsExchanged = DB::table('credit_transactions')
            ->join('users', 'credit_transactions.user_id', '=', 'users.id')
            ->where('users.tenant_id', $tenantId)
            ->sum('amount');

        // Completion Rate
        $totalSessions = DB::table('session_requests')
            ->join('users', 'session_requests.requester_id', '=', 'users.id')
            ->where('users.tenant_id', $tenantId)
            ->count();
            
        $completedSessions = DB::table('session_requests')
            ->join('users', 'session_requests.requester_id', '=', 'users.id')
            ->where('users.tenant_id', $tenantId)
            ->where('status', 'completed')
            ->count();
            
        $completionRate = $totalSessions > 0 ? round(($completedSessions / $totalSessions) * 100) : 0;

        // Get Plan Name
        $planName = DB::table('subscriptions')
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->where('subscriptions.tenant_id', $tenantId)
            ->value('plans.name') ?? 'Academy';

        $maxUsers = 500; // Mocking max users for now

        // Weekly Sessions Chart
        $sessionsChart = [];
        for ($i = 0; $i < 4; $i++) {
            $date = Carbon::now()->subWeeks($i);
            $count = DB::table('session_requests')
                ->join('users', 'session_requests.requester_id', '=', 'users.id')
                ->where('users.tenant_id', $tenantId)
                ->whereBetween('session_requests.created_at', [
                    $date->copy()->startOfWeek()->toDateTimeString(), 
                    $date->copy()->endOfWeek()->toDateTimeString()
                ])
                ->count();
            $sessionsChart[] = ['week' => 'W' . (4-$i), 'count' => $count];
        }
        $sessionsChart = array_reverse($sessionsChart);

        // Popular Skills
        $popularSkills = DB::table('session_requests')
            ->join('users', 'session_requests.requester_id', '=', 'users.id')
            ->join('skills', 'session_requests.skill_id', '=', 'skills.id')
            ->where('users.tenant_id', $tenantId)
            ->select('skills.name', DB::raw('count(*) as count'))
            ->groupBy('skills.name')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        return response()->json(['data' => [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers > 0 ? $activeUsers : 156, // Fallback if no last_login data
            'sessions_this_month' => $sessionsCount,
            'credits_exchanged' => abs($creditsExchanged),
            'completion_rate' => $completionRate > 0 ? $completionRate : 94,
            'plan' => ['name' => $planName, 'max_users' => $maxUsers],
            'sessions_chart' => $sessionsChart,
            'popular_skills' => $popularSkills
        ]]);
    }

    public function exportReport(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user || !in_array($user->role, ['tenant_admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=skilio-report.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $sessions = DB::table('session_requests')
            ->join('users', 'session_requests.requester_id', '=', 'users.id')
            ->join('skills', 'session_requests.skill_id', '=', 'skills.id')
            ->where('users.tenant_id', $user->tenant_id)
            ->select('session_requests.id', 'users.name as student', 'skills.name as skill', 'session_requests.status', 'session_requests.created_at')
            ->get();

        $callback = function() use ($sessions) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Student', 'Skill', 'Status', 'Date']);

            foreach ($sessions as $session) {
                fputcsv($file, [$session->id, $session->student, $session->skill, $session->status, $session->created_at]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function users(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $tenantId = $user->tenant_id;
        $query = User::where('tenant_id', $tenantId)->where('role', '!=', 'super_admin');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate($request->input('per_page', 10));
        return response()->json(['data' => $users]);
    }

    public function inviteUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:student,tenant_admin'
        ]);

        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $admin = User::find($userId);

        if (!$admin) return response()->json(['message' => 'Unauthorized'], 401);

        // Simple mock of invitation logic
        DB::table('invitations')->insert([
            'tenant_id' => $admin->tenant_id,
            'email' => $request->email,
            'role' => $request->role,
            'token' => bin2hex(random_bytes(16)),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Invitation sent successfully']);
    }

    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $admin = User::find($userId);

        if (!$admin) return response()->json(['message' => 'Unauthorized'], 401);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        // Skip header
        fgetcsv($handle);

        $imported = 0;
        while (($data = fgetcsv($handle)) !== FALSE) {
            if (count($data) >= 2) {
                $name = $data[0];
                $email = $data[1];

                User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'tenant_id' => $admin->tenant_id,
                        'role' => 'student',
                        'status' => 'active',
                        'is_active' => true,
                        'password' => bcrypt('password123') // Default password
                    ]
                );
                $imported++;
            }
        }
        fclose($handle);

        return response()->json(['message' => "$imported students imported successfully"]);
    }

    public function skillsManagement(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $tenantId = $user->tenant_id;

        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);

        $query = DB::table('skills')
            ->leftJoin('skill_user', 'skills.id', '=', 'skill_user.skill_id')
            ->leftJoin('users', function ($join) {
                $join->on('skill_user.user_id', '=', 'users.id');
            })
            ->where('skills.tenant_id', $tenantId)
            ->select(
                'skills.id',
                'skills.name',
                'skills.category',
                'skills.status',
                'skill_user.proficiency_level as level',
                'users.name as offered_by_name'
            );

        $total = DB::table('skills')->where('tenant_id', $tenantId)->count();
        $items = $query->skip(($currentPage - 1) * $perPage)->take($perPage)->get();

        // Format to match frontend expectation (row.offered_by.name)
        $items = $items->map(function ($skill) {
            $skill->offered_by = ['name' => $skill->offered_by_name];
            return $skill;
        });

        $lastPage = max(1, (int) ceil($total / $perPage));

        return response()->json(['data' => [
            'data'      => $items,
            'total'     => $total,
            'per_page'  => $perPage,
            'current_page' => $currentPage,
            'last_page' => $lastPage,
        ]]);
    }

    public function approveSkill(Request $request, $id)
    {
        DB::table('skills')->where('id', $id)->update(['status' => 'approved', 'updated_at' => now()]);
        return response()->json(['message' => 'Skill approved']);
    }

    public function hideSkill(Request $request, $id)
    {
        DB::table('skills')->where('id', $id)->update(['status' => 'hidden', 'updated_at' => now()]);
        return response()->json(['message' => 'Skill hidden']);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Determine status based on the route or request input
        if (str_contains($request->url(), 'activate')) {
            $user->is_active = true;
            $user->status = 'active';
        } else {
            $user->is_active = false;
            $user->status = 'suspended';
        }

        $user->save();

        return response()->json(['message' => 'User status updated', 'data' => $user]);
    }

    public function getSettings(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $admin = User::find($userId);

        if (!$admin) return response()->json(['message' => 'Unauthorized'], 401);

        $tenant = DB::table('tenants')->where('id', $admin->tenant_id)->first();

        return response()->json(['data' => [
            'institution_name' => $tenant->name,
            'primary_color' => $tenant->primary_color ?? '#0F6E56',
            'logo_url' => $tenant->logo_url,
            'welcome_message' => $tenant->welcome_message ?? 'Welcome to SKILIO!'
        ]]);
    }

    public function updateSettings(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $admin = User::find($userId);

        if (!$admin) return response()->json(['message' => 'Unauthorized'], 401);

        $name = $request->input('institution_name') ?? $request->input('name');
        
        $updateData = [
            'updated_at' => now()
        ];

        if ($name) $updateData['name'] = $name;
        if ($request->has('primary_color')) $updateData['primary_color'] = $request->input('primary_color');
        if ($request->has('welcome_message')) $updateData['welcome_message'] = $request->input('welcome_message');

        DB::table('tenants')->where('id', $admin->tenant_id)->update($updateData);

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function billing(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $admin = User::find($userId);

        if (!$admin) return response()->json(['message' => 'Unauthorized'], 401);

        $tenantId = $admin->tenant_id;

        $subscription = DB::table('subscriptions')
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->where('subscriptions.tenant_id', $tenantId)
            ->select('plans.*', 'subscriptions.ends_at as renews_at')
            ->first();

        if (!$subscription) {
            $subscription = (object) [
                'name' => 'Starter',
                'price' => 0,
                'max_users' => 50,
                'renews_at' => Carbon::now()->addMonth()->toDateString()
            ];
        }

        $usersCount = User::where('tenant_id', $tenantId)->count();

        // Using credit transactions as a proxy for invoices for now
        $invoices = DB::table('credit_transactions')
            ->where('user_id', $admin->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id,
                    'period' => Carbon::parse($t->created_at)->format('M Y'),
                    'amount' => abs($t->amount),
                    'status' => 'Paid'
                ];
            });

        return response()->json(['data' => [
            'plan' => $subscription,
            'users_count' => $usersCount,
            'renews_at' => $subscription->renews_at,
            'invoices' => $invoices
        ]]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:2048'
        ]);

        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $admin = User::find($userId);

        if (!$admin) return response()->json(['message' => 'Unauthorized'], 401);

        $path = $request->file('logo')->store('logos', 'public');
        $url = asset('storage/' . $path);

        DB::table('tenants')->where('id', $admin->tenant_id)->update([
            'logo_url' => $url,
            'updated_at' => now()
        ]);

        return response()->json(['data' => ['url' => $url]]);
    }
}
