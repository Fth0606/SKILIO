<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'price_monthly' => 0.00,
                'price_yearly' => 0.00,
                'max_users' => 50,
                'max_skills_per_user' => 5,
                'features' => json_encode(['Up to 50 users', '5 skills per user', 'Basic support']),
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Academy',
                'slug' => 'academy',
                'price_monthly' => 99.00,
                'price_yearly' => 990.00,
                'max_users' => 500,
                'max_skills_per_user' => 20,
                'features' => json_encode(['Up to 500 users', '20 skills per user', 'Advanced analytics', 'Priority support']),
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'price_monthly' => 299.00,
                'price_yearly' => 2990.00,
                'max_users' => 10000,
                'max_skills_per_user' => 100,
                'features' => json_encode(['Unlimited users', '100 skills per user', 'White labeling', 'Dedicated support', 'API access']),
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($plans as $plan) {
            DB::table('plans')->updateOrInsert(['slug' => $plan['slug']], $plan);
        }
    }
}
