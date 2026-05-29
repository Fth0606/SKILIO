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
            'verification_token' => bin2hex(random_bytes(32)),
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

    public function updateProfile(Request $request)
    {
        $token  = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user   = User::find($userId);

        if (!$user) return response()->json(['message' => 'Non autorisé'], 401);

        $request->validate([
            'name'            => 'required|string|max:255',
            'bio'             => 'nullable|string|max:1000',
            'department'      => 'nullable|string|max:100',
            'graduation_year' => 'nullable|integer|min:2000|max:2040',
            'avatar_url'      => 'nullable|url|max:500',
            'current_password'    => 'required_with:new_password',
            'new_password'        => 'nullable|min:6|confirmed',
        ]);

        // Password change requested
        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['errors' => ['current_password' => ['Mot de passe actuel incorrect.']]], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->name            = $request->name;
        $user->bio             = $request->bio;
        $user->department      = $request->department;
        $user->graduation_year = $request->graduation_year;
        $user->avatar_url      = $request->avatar_url;
        $user->save();

        $user->load(['tenant', 'availability']);
        $user->skills = \Illuminate\Support\Facades\DB::table('skill_user')
            ->join('skills', 'skill_user.skill_id', '=', 'skills.id')
            ->where('skill_user.user_id', $user->id)
            ->select('skills.id', 'skills.name', 'skills.category', 'skill_user.proficiency_level as level')
            ->get();

        return response()->json(['data' => $user, 'message' => 'Profil mis à jour avec succès']);
    }

    public function deleteAccount(Request $request)
    {
        $token  = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user   = User::find($userId);

        if (!$user) return response()->json(['message' => 'Non autorisé'], 401);

        $request->validate([
            'password' => 'required',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['errors' => ['password' => ['Mot de passe incorrect.']]], 422);
        }

        // Anonymise and deactivate — preserves referential integrity for sessions/ratings
        \Illuminate\Support\Facades\DB::table('skill_user')->where('user_id', $user->id)->delete();
        \Illuminate\Support\Facades\DB::table('user_availability')->where('user_id', $user->id)->delete();
        \Illuminate\Support\Facades\DB::table('notifications')->where('user_id', $user->id)->delete();

        $user->update([
            'name'            => 'Compte supprimé',
            'email'           => 'deleted-' . $user->id . '@skilio.invalid',
            'bio'             => null,
            'avatar_url'      => null,
            'department'      => null,
            'graduation_year' => null,
            'is_active'       => false,
            'password'        => Hash::make(\Illuminate\Support\Str::random(40)),
        ]);

        return response()->json(['message' => 'Compte supprimé avec succès']);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate(['token' => 'required']);

        $user = User::where('verification_token', $request->token)->first();

        if (!$user) {
            return response()->json(['message' => 'Jeton de vérification invalide.'], 422);
        }

        $user->update([
            'email_verified_at' => now(),
            'verification_token' => null,
        ]);

        return response()->json(['message' => 'Email vérifié avec succès']);
    }

    public function acceptInvitation(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'name' => 'required|string|max:255',
            'password' => 'required|min:6',
        ]);

        $invitation = \Illuminate\Support\Facades\DB::table('invitations')
            ->where('token', $request->token)
            ->whereNull('accepted_at')
            ->first();

        if (!$invitation) {
            return response()->json(['message' => 'Invitation invalide ou déjà acceptée.'], 422);
        }

        // Check if user already exists
        if (User::where('email', $invitation->email)->exists()) {
             return response()->json(['message' => 'Un utilisateur avec cet email existe déjà.'], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $invitation->email,
            'password' => Hash::make($request->password),
            'tenant_id' => $invitation->tenant_id,
            'role' => $invitation->role,
            'is_active' => true,
            'email_verified_at' => now(),
            'credits_balance' => 3.00,
        ]);

        \Illuminate\Support\Facades\DB::table('invitations')
            ->where('id', $invitation->id)
            ->update(['accepted_at' => now()]);

        return response()->json([
            'token' => 'mock-token-' . $user->id,
            'user' => $user,
            'message' => 'Invitation acceptée avec succès'
        ], 201);
    }
}
