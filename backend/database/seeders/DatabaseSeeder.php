<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Plans
        $this->call(PlanSeeder::class);

        $starterPlan = DB::table('plans')->where('slug', 'starter')->first();
        $academyPlan = DB::table('plans')->where('slug', 'academy')->first();
        $enterprisePlan = DB::table('plans')->where('slug', 'enterprise')->first();

        // 2. Create Tenants
        $tenantsData = [
            [
                'name' => 'Harvard University',
                'subdomain' => 'harvard',
                'email' => 'admin@harvard.edu',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'name' => 'Oxford University',
                'subdomain' => 'oxford',
                'email' => 'admin@oxford.edu',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'name' => 'MIT',
                'subdomain' => 'mit',
                'email' => 'admin@mit.edu',
                'is_active' => true,
                'created_at' => now(),
            ],
        ];

        foreach ($tenantsData as $t) {
            $tenantId = DB::table('tenants')->insertGetId($t);

            // Assign Plan via Subscription
            $plan = null;
            if ($t['name'] == 'Harvard University') $plan = $starterPlan;
            elseif ($t['name'] == 'Oxford University') $plan = $academyPlan;
            else $plan = $enterprisePlan;
            
            DB::table('subscriptions')->insert([
                'tenant_id' => $tenantId,
                'plan_id' => $plan->id,
                'stripe_status' => 'active',
                'created_at' => now(),
            ]);

            // 3. Create Admin for each tenant
            $emailPrefix = '';
            if ($t['name'] == 'Harvard University') $emailPrefix = 'starter';
            elseif ($t['name'] == 'Oxford University') $emailPrefix = 'academy';
            else $emailPrefix = 'enterprise';
            
            DB::table('users')->insert([
                'tenant_id' => $tenantId,
                'name' => $t['name'] . ' Admin',
                'email' => $emailPrefix . '@' . ($t['subdomain'] == 'mit' ? 'mit.edu' : $t['subdomain'] . '.edu'),
                'password' => Hash::make('password'),
                'role' => 'tenant_admin',
                'created_at' => now(),
            ]);

            // 4. Create a Student for Harvard (legacy, keeping for compatibility)
            if ($t['name'] == 'Harvard University') {
                DB::table('users')->insert([
                    'tenant_id' => $tenantId,
                    'name' => 'John Student',
                    'email' => 'student@harvard.edu',
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'credits_balance' => 5.00,
                    'created_at' => now(),
                ]);
            }
        }

        // 5. Create Super Admin
        $firstTenantId = DB::table('tenants')->first()->id;
        
        DB::table('users')->insert([
            'tenant_id' => $firstTenantId,
            'name' => 'Global Admin',
            'email' => 'superadmin@skillswap.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'created_at' => now(),
        ]);

        // 6. Run New Comprehensive Seeders
        $this->call([
            SkillSeeder::class,
            UserExtraSeeder::class,
            SkillUserSeeder::class,
            SessionRequestSeeder::class,
            SupportTicketSeeder::class,
            CreditTransactionSeeder::class,
        ]);
    }
}
