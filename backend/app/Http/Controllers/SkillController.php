<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['data' => []]);

        $query = Skill::where(function($q) use ($user) {
            $q->where('tenant_id', $user->tenant_id)
              ->orWhere('is_global', true);
        });

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return response()->json(['data' => $query->paginate($request->input('per_page', 15))]);
    }

    public function categories()
    {
        return response()->json(['data' => ['Programmation', 'Langues', 'IA/Data', 'Musique', 'Maths', 'Créatif', 'Soft Skills']]);
    }

    public function store(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['message' => 'Non autorisé'], 401);

        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'level' => 'required|string'
        ]);

        // Find or create the skill in this tenant
        $skill = Skill::firstOrCreate(
            ['name' => $request->name, 'tenant_id' => $user->tenant_id],
            ['category' => $request->category, 'description' => $request->description]
        );

        // Attach to user if not already attached
        $exists = DB::table('skill_user')
            ->where('user_id', $user->id)
            ->where('skill_id', $skill->id)
            ->exists();

        if (!$exists) {
            DB::table('skill_user')->insert([
                'user_id' => $user->id,
                'skill_id' => $skill->id,
                'proficiency_level' => strtolower($request->level),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Compétence ajoutée avec succès', 'data' => $skill]);
    }

    public function userSkills(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['data' => []]);

        $skills = DB::table('skill_user')
            ->join('skills', 'skill_user.skill_id', '=', 'skills.id')
            ->where('skill_user.user_id', $user->id)
            ->select('skills.*', 'skill_user.proficiency_level as level')
            ->get();

        return response()->json(['data' => $skills]);
    }

    public function destroy(Request $request, $id)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['message' => 'Non autorisé'], 401);

        DB::table('skill_user')
            ->where('user_id', $user->id)
            ->where('skill_id', $id)
            ->delete();

        return response()->json(['message' => 'Compétence supprimée']);
    }

    public function teachers(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $currentUser = User::find($userId);

        if (!$currentUser) return response()->json(['data' => []]);

        $query = User::where('tenant_id', $currentUser->tenant_id)
            ->where('id', '!=', $currentUser->id)
            ->whereHas('skills');

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('skills', function($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('skills', function($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        if ($request->filled('level')) {
            $query->whereHas('skills', function($q) use ($request) {
                $q->where('skill_user.proficiency_level', strtolower($request->level));
            });
        }

        $teachers = $query->with(['skills', 'availability'])->paginate($request->input('per_page', 12));

        return response()->json(['data' => $teachers]);
    }

    public function setAvailability(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['message' => 'Non autorisé'], 401);

        $slots = $request->input('slots', []);
        
        // Clear existing availability
        \App\Models\UserAvailability::where('user_id', $user->id)->delete();

        foreach ($slots as $slot) {
            if (!isset($slot['start']) || !isset($slot['end'])) continue;
            
            \App\Models\UserAvailability::create([
                'user_id' => $user->id,
                'day_of_week' => $slot['day_index'],
                'start_time' => $slot['start'],
                'end_time' => $slot['end'],
                'is_active' => true,
            ]);
        }

        return response()->json(['message' => 'Disponibilités enregistrées avec succès']);
    }
}
