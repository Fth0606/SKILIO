<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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
