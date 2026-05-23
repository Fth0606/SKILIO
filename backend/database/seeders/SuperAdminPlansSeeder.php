<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuperAdminPlansSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'max_users' => 50,
                'max_skills_per_user' => 5,
                'features' => json_encode([
                    'basic_skills' => true,
                    'email_support' => true,
                    'basic_analytics' => false,
                    'api_access' => false,
                    'custom_branding' => false,
                    'priority_support' => false,
                ]),
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Academy',
                'slug' => 'academy',
                'price_monthly' => 99,
                'price_yearly' => 990,
                'max_users' => 500,
                'max_skills_per_user' => 20,
                'features' => json_encode([
                    'basic_skills' => true,
                    'email_support' => true,
                    'basic_analytics' => true,
                    'api_access' => true,
                    'custom_branding' => false,
                    'priority_support' => false,
                ]),
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'price_monthly' => 199,
                'price_yearly' => 1990,
                'max_users' => 1000,
                'max_skills_per_user' => 50,
                'features' => json_encode([
                    'basic_skills' => true,
                    'email_support' => true,
                    'basic_analytics' => true,
                    'api_access' => true,
                    'custom_branding' => true,
                    'priority_support' => false,
                ]),
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'price_monthly' => 499,
                'price_yearly' => 4990,
                'max_users' => -1, // Unlimited
                'max_skills_per_user' => -1, // Unlimited
                'features' => json_encode([
                    'basic_skills' => true,
                    'email_support' => true,
                    'basic_analytics' => true,
                    'api_access' => true,
                    'custom_branding' => true,
                    'priority_support' => true,
                    'white_label' => true,
                    'sso' => true,
                    'custom_integrations' => true,
                ]),
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($plans as $plan) {
            DB::table('plans')->updateOrInsert(['slug' => $plan['slug']], $plan);
        }

        $this->command->info('✓ SuperAdmin Plans seeded: ' . count($plans) . ' plans');
    }
}