<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SessionRequestSeeder extends Seeder
{
    public function run(): void
    {
        $students = DB::table('users')->where('role', 'student')->get();
        
        foreach ($students as $student) {
            // Find teachers in the same tenant
            $teachers = DB::table('users')
                ->where('tenant_id', $student->tenant_id)
                ->where('role', 'teacher')
                ->get();

            if ($teachers->isEmpty()) continue;

            $teacher = $teachers->first();
            $skill = DB::table('skill_user')->where('user_id', $teacher->id)->first();

            if (!$skill) continue;

            // Create a pending session
            DB::table('session_requests')->insert([
                'requester_id' => $student->id,
                'teacher_id' => $teacher->id,
                'skill_id' => $skill->skill_id,
                'scheduled_at' => now()->addDays(2),
                'status' => 'pending',
                'credits_held' => 1.00,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create a completed session
            DB::table('session_requests')->insert([
                'requester_id' => $student->id,
                'teacher_id' => $teacher->id,
                'skill_id' => $skill->skill_id,
                'scheduled_at' => now()->subDays(2),
                'status' => 'completed',
                'requester_confirmed' => true,
                'teacher_confirmed' => true,
                'credits_held' => 1.00,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(2),
            ]);
        }
    }
}
