<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillUserSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = DB::table('users')->where('role', 'teacher')->get();
        $skills = DB::table('skills')->get();

        foreach ($teachers as $teacher) {
            // Assign 2 random skills from the same tenant
            $tenantSkills = $skills->where('tenant_id', $teacher->tenant_id)->shuffle()->take(2);
            
            foreach ($tenantSkills as $skill) {
                DB::table('skill_user')->insertOrIgnore([
                    'user_id' => $teacher->id,
                    'skill_id' => $skill->id,
                    'proficiency_level' => 'advanced',
                    'hourly_rate_credits' => 1.00,
                    'teaching_description' => 'I can help you master ' . $skill->name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
