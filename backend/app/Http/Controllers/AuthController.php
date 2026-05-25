<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        // Extract domain from user's email
        $userEmailParts = explode('@', $request->email);
        $userDomain = end($userEmailParts);

        // Resolve tenant from subdomain header
        $subdomain = $request->header('X-Tenant');
        $tenant = null;

        if ($subdomain) {
            $tenant = Tenant::where('subdomain', $subdomain)->where('is_active', true)->first();

            if ($tenant) {
                $tenantEmailParts = explode('@', $tenant->email);
                $tenantDomain = end($tenantEmailParts);

                if (strtolower($userDomain) !== strtolower($tenantDomain)) {
                    return response()->json(['message' => "Votre email doit appartenir au domaine {$tenantDomain}."], 422);
                }
            }
        }

        // If no tenant matched or no subdomain header, try to find a tenant by email domain
        if (empty($tenant)) {
            $tenants = Tenant::where('is_active', true)->get();
            foreach ($tenants as $t) {
                $tenantEmailParts = explode('@', $t->email);
                $tDomain = end($tenantEmailParts);
                if (strtolower($userDomain) === strtolower($tDomain)) {
                    $tenant = $t;
                    break;
                }
            }
        }

        if (!$tenant) {
            return response()->json(['message' => 'Votre email n\'est rattaché à aucun établissement autorisé.'], 422);
        }

        // Check email uniqueness within this tenant
        if (User::where('email', $request->email)->where('tenant_id', $tenant->id)->exists()) {
            return response()->json(['message' => 'Un compte existe déjà avec cet email.'], 422);
        }

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'tenant_id' => $tenant->id,
            'role'      => 'student',
            'is_active' => true,
            'credits_balance' => 3.00,
        ]);

        $user->load('tenant');

        return response()->json([
            'token' => 'mock-token-' . $user->id,
            'user'  => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $user->load('tenant');

        // For now, since we don't have Sanctum/Passport setup yet, 
        // we will just return the user data.
        return response()->json([
            'token' => 'mock-token-' . $user->id,
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::with(['tenant', 'availability'])->find($userId);

        if (!$user) return response()->json(['message' => 'Non autorisé'], 401);

        // Manually attach skills for now
        $user->skills = \Illuminate\Support\Facades\DB::table('skill_user')
            ->join('skills', 'skill_user.skill_id', '=', 'skills.id')
            ->where('skill_user.user_id', $user->id)
            ->select('skills.id', 'skills.name', 'skills.category', 'skill_user.proficiency_level as level')
            ->get();

        return response()->json(['data' => $user]);
    }

    public function logout()
    {
        return response()->json(['message' => 'Déconnecté']);
    }
}
