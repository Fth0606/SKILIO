<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = DB::table('tenants')->get();
        
        $skills = [
            ['name' => 'React Development', 'category' => 'Programming', 'description' => 'Build modern web apps with React.'],
            ['name' => 'Laravel Framework', 'category' => 'Programming', 'description' => 'PHP framework for web artisans.'],
            ['name' => 'Python for Data Science', 'category' => 'Programming', 'description' => 'Analyze data with Python.'],
            ['name' => 'UI/UX Design', 'category' => 'Design', 'description' => 'Create beautiful user interfaces.'],
            ['name' => 'Academic Writing', 'category' => 'Academic', 'description' => 'Improve your research papers.'],
            ['name' => 'French Language', 'category' => 'Language', 'description' => 'Learn conversational French.'],
            ['name' => 'Financial Literacy', 'category' => 'Finance', 'description' => 'Manage your money better.'],
            ['name' => 'Public Speaking', 'category' => 'Soft Skills', 'description' => 'Master the art of speaking in public.'],
        ];

        foreach ($tenants as $tenant) {
            foreach ($skills as $skill) {
                DB::table('skills')->updateOrInsert(
                    ['name' => $skill['name'], 'tenant_id' => $tenant->id],
                    array_merge($skill, [
                        'tenant_id' => $tenant->id,
                        'is_global' => false,
                        'is_approved' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ])
                );
            }
        }
    }
}
