<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\SupportTicket;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function analytics()
    {
        return response()->json(['data' => [
            'total_tenants' => Tenant::count(),
            'total_users' => User::count(),
            'total_sessions' => DB::table('session_requests')->count(),
            'mrr' => 51200, // Mocked for now
            'churn_rate' => 4.2 // Mocked for now
        ]]);
    }

    public function tenants(Request $request)
    {
        $query = Tenant::with(['plan'])->withCount('users');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('subdomain', 'like', '%' . $request->search . '%');
        }

        $tenants = $query->paginate($request->input('per_page', 15));

        $tenants->getCollection()->transform(function ($tenant) {
            $tenant->status = $tenant->is_active ? 'active' : 'suspended';
            return $tenant;
        });

        return response()->json(['data' => $tenants]);
    }

    public function createTenant(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:100|unique:tenants',
            'email' => 'required|email|max:255',
            'plan_id' => 'required|exists:plans,id',
        ]);

        $tenant = Tenant::create($validated);

        return response()->json(['data' => $tenant, 'message' => 'Établissement créé avec succès']);
    }

    public function suspendTenant($id)
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->update(['is_active' => false]);

        return response()->json(['message' => 'Établissement suspendu']);
    }

    public function activateTenant($id)
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->update(['is_active' => true]);

        return response()->json(['message' => 'Établissement activé']);
    }

    public function plans()
    {
        $plans = Plan::all()->map(function($plan) {
            // Map price_monthly to price for frontend compatibility if needed
            $plan->price = $plan->price_monthly;
            $plan->published = (bool)$plan->is_public;
            return $plan;
        });
        return response()->json(['data' => $plans]);
    }

    public function revenue()
    {
        // Mocking revenue data
        return response()->json(['data' => [
            'mrr_chart' => [
                ['month' => 'Jan', 'value' => 42000],
                ['month' => 'Feb', 'value' => 45000],
                ['month' => 'Mar', 'value' => 48000],
                ['month' => 'Apr', 'value' => 51200],
            ],
            'sessions_chart' => [
                ['month' => 'Jan', 'value' => 85000],
                ['month' => 'Feb', 'value' => 92000],
                ['month' => 'Mar', 'value' => 110000],
                ['month' => 'Apr', 'value' => 124567],
            ],
            'forecast' => 54000
        ]]);
    }

    public function tickets(Request $request)
    {
        $query = SupportTicket::with(['tenant', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tickets = $query->latest()->paginate($request->input('per_page', 15));

        return response()->json(['data' => $tickets]);
    }

    public function resolveTicket($id)
    {
        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'status' => 'resolved',
            'resolved_at' => now()
        ]);

        return response()->json(['message' => 'Ticket résolu']);
    }
}
