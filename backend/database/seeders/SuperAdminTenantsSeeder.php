<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperAdminTenantsSeeder extends Seeder
{
    public function run(): void
    {
        $plans = DB::table('plans')->get()->keyBy('slug');
        
        if ($plans->isEmpty()) {
            $this->command->warn('No plans found. Please run PlanSeeder first.');
            return;
        }

        $tenants = [
            ['name' => 'Harvard University', 'subdomain' => 'harvard', 'email' => 'admin@harvard.edu', 'logo_url' => null, 'primary_color' => '#8C001A', 'secondary_color' => '#1E3A5F', 'custom_css' => null, 'max_users' => 10000, 'is_active' => true, 'created_at' => now()->subMonths(24), 'updated_at' => now()],
            ['name' => 'Stanford University', 'subdomain' => 'stanford', 'email' => 'admin@stanford.edu', 'logo_url' => null, 'primary_color' => '#8C1515', 'secondary_color' => '#FFFFFF', 'custom_css' => null, 'max_users' => 5000, 'is_active' => true, 'created_at' => now()->subMonths(20), 'updated_at' => now()],
            ['name' => 'MIT', 'subdomain' => 'mit', 'email' => 'admin@mit.edu', 'logo_url' => null, 'primary_color' => '#A31F34', 'secondary_color' => '#FFFFFF', 'custom_css' => null, 'max_users' => 3000, 'is_active' => true, 'created_at' => now()->subMonths(18), 'updated_at' => now()],
            ['name' => 'Oxford University', 'subdomain' => 'oxford', 'email' => 'admin@oxford.ac.uk', 'logo_url' => null, 'primary_color' => '#002147', 'secondary_color' => '#1C4C91', 'custom_css' => null, 'max_users' => 8000, 'is_active' => true, 'created_at' => now()->subMonths(15), 'updated_at' => now()],
            ['name' => 'Cambridge University', 'subdomain' => 'cambridge', 'email' => 'admin@cambridge.ac.uk', 'logo_url' => null, 'primary_color' => '#003865', 'secondary_color' => '#A2C117', 'custom_css' => null, 'max_users' => 6000, 'is_active' => true, 'created_at' => now()->subMonths(12), 'updated_at' => now()],
            ['name' => 'Princeton University', 'subdomain' => 'princeton', 'email' => 'admin@princeton.edu', 'logo_url' => null, 'primary_color' => '#FF6000', 'secondary_color' => '#000000', 'custom_css' => null, 'max_users' => 2500, 'is_active' => true, 'created_at' => now()->subMonths(10), 'updated_at' => now()],
            ['name' => 'Yale University', 'subdomain' => 'yale', 'email' => 'admin@yale.edu', 'logo_url' => null, 'primary_color' => '#00356B', 'secondary_color' => '#FFFFFF', 'custom_css' => null, 'max_users' => 3500, 'is_active' => true, 'created_at' => now()->subMonths(8), 'updated_at' => now()],
            ['name' => 'Columbia University', 'subdomain' => 'columbia', 'email' => 'admin@columbia.edu', 'logo_url' => null, 'primary_color' => '#002D72', 'secondary_color' => '#761D4B', 'custom_css' => null, 'max_users' => 4000, 'is_active' => true, 'created_at' => now()->subMonths(6), 'updated_at' => now()],
            ['name' => 'Berkeley University', 'subdomain' => 'berkeley', 'email' => 'admin@berkeley.edu', 'logo_url' => null, 'primary_color' => '#003262', 'secondary_color' => '#D6C94E', 'custom_css' => null, 'max_users' => 4500, 'is_active' => true, 'created_at' => now()->subMonths(4), 'updated_at' => now()],
            ['name' => 'UCLA', 'subdomain' => 'ucla', 'email' => 'admin@ucla.edu', 'logo_url' => null, 'primary_color' => '#2774AE', 'secondary_color' => '#FFD100', 'custom_css' => null, 'max_users' => 5000, 'is_active' => false, 'created_at' => now()->subMonths(3), 'updated_at' => now()->subDays(5)],
        ];

        $tenantIds = [];
        $planAssignments = [
            'harvard' => 'starter', 'stanford' => 'enterprise', 'mit' => 'professional',
            'oxford' => 'academy', 'cambridge' => 'academy', 'princeton' => 'professional',
            'yale' => 'enterprise', 'columbia' => 'professional', 'berkeley' => 'academy', 'ucla' => 'starter',
        ];

        foreach ($tenants as $tenantData) {
            $subdomain = $tenantData['subdomain'];
            $existing = DB::table('tenants')->where('subdomain', $subdomain)->first();
            
            if ($existing) {
                $tenantIds[$subdomain] = $existing->id;
                DB::table('tenants')->where('id', $existing->id)->update([
                    'name' => $tenantData['name'], 'email' => $tenantData['email'],
                    'primary_color' => $tenantData['primary_color'], 'secondary_color' => $tenantData['secondary_color'],
                    'max_users' => $tenantData['max_users'], 'is_active' => $tenantData['is_active'],
                    'updated_at' => $tenantData['updated_at'],
                ]);
            } else {
                $tenantIds[$subdomain] = DB::table('tenants')->insertGetId([
                    'name' => $tenantData['name'], 'subdomain' => $subdomain, 'email' => $tenantData['email'],
                    'logo_url' => $tenantData['logo_url'], 'primary_color' => $tenantData['primary_color'],
                    'secondary_color' => $tenantData['secondary_color'], 'custom_css' => $tenantData['custom_css'],
                    'max_users' => $tenantData['max_users'], 'is_active' => $tenantData['is_active'],
                    'created_at' => $tenantData['created_at'], 'updated_at' => $tenantData['updated_at'],
                ]);
            }

            // Create subscription
            $planSlug = $planAssignments[$subdomain] ?? 'starter';
            $plan = $plans->get($planSlug);
            if ($plan && !DB::table('subscriptions')->where('tenant_id', $tenantIds[$subdomain])->where('plan_id', $plan->id)->exists()) {
                DB::table('subscriptions')->insert([
                    'tenant_id' => $tenantIds[$subdomain], 'plan_id' => $plan->id, 'price' => $plan->price_monthly,
                    'billing_cycle' => 'monthly', 'status' => $tenantData['is_active'] ? 'active' : 'suspended',
                    'stripe_status' => 'active', 'starts_at' => now()->subMonths(6), 'ends_at' => now()->addMonth(),
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }

            // Create admin user
            if (!DB::table('users')->where('email', $tenantData['email'])->exists()) {
                DB::table('users')->insert([
                    'tenant_id' => $tenantIds[$subdomain], 'name' => explode(' ', $tenantData['name'])[0] . ' Admin',
                    'email' => $tenantData['email'], 'password' => Hash::make('password123'),
                    'role' => 'tenant_admin', 'is_active' => $tenantData['is_active'],
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }

        $this->createSampleUsers($tenantIds['harvard'] ?? 1);
        $this->command->info('✓ SuperAdmin Tenants seeded: ' . count($tenants) . ' tenants');
    }

    private function createSampleUsers($tenantId)
    {
        $teachers = [
            ['name' => 'Dr. Sarah Johnson', 'email' => 'sarah.johnson@harvard.edu', 'bio' => 'Expert in Computer Science'],
            ['name' => 'Prof. Michael Chen', 'email' => 'michael.chen@harvard.edu', 'bio' => 'Data Science specialist'],
            ['name' => 'Dr. Emily Davis', 'email' => 'emily.davis@harvard.edu', 'bio' => 'Web Development expert'],
            ['name' => 'Prof. James Wilson', 'email' => 'james.wilson@harvard.edu', 'bio' => 'Mathematics professor'],
        ];

        foreach ($teachers as $teacher) {
            if (!DB::table('users')->where('email', $teacher['email'])->exists()) {
                $userId = DB::table('users')->insertGetId([
                    'tenant_id' => $tenantId, 'name' => $teacher['name'], 'email' => $teacher['email'],
                    'password' => Hash::make('password123'), 'role' => 'teacher', 'bio' => $teacher['bio'],
                    'credits_balance' => 100.00, 'total_credits_earned' => 500.00, 'is_active' => true,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
                $skills = DB::table('skills')->limit(2)->get();
                foreach ($skills as $skill) {
                    DB::table('skill_user')->insert(['user_id' => $userId, 'skill_id' => $skill->id, 'proficiency_level' => 'expert', 'created_at' => now()]);
                }
            }
        }

        $students = [
            ['name' => 'Alex Thompson', 'email' => 'alex.thompson@harvard.edu'],
            ['name' => 'Maria Garcia', 'email' => 'maria.garcia@harvard.edu'],
            ['name' => 'David Kim', 'email' => 'david.kim@harvard.edu'],
            ['name' => 'Lisa Anderson', 'email' => 'lisa.anderson@harvard.edu'],
            ['name' => 'Robert Martinez', 'email' => 'robert.martinez@harvard.edu'],
        ];

        foreach ($students as $student) {
            if (!DB::table('users')->where('email', $student['email'])->exists()) {
                DB::table('users')->insert([
                    'tenant_id' => $tenantId, 'name' => $student['name'], 'email' => $student['email'],
                    'password' => Hash::make('password123'), 'role' => 'student',
                    'credits_balance' => 50.00, 'total_credits_spent' => 150.00, 'is_active' => true,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }
    }
}