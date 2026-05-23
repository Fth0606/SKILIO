<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuperAdminRevenueSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = DB::table('tenants')->get();
        
        if ($tenants->isEmpty()) {
            $this->command->warn('No tenants found. Please run TenantsSeeder first.');
            return;
        }

        // Create historical subscription data for revenue charts
        // MRR data for last 6 months
        $mrrData = [
            now()->subMonths(5)->format('Y-m') => 12500,
            now()->subMonths(4)->format('Y-m') => 15800,
            now()->subMonths(3)->format('Y-m') => 18200,
            now()->subMonths(2)->format('Y-m') => 21500,
            now()->subMonths(1)->format('Y-m') => 24800,
            now()->format('Y-m') => 28400,
        ];

        // Create monthly subscriptions to simulate MRR growth
        $monthlyPrice = 99;
        
        foreach ($mrrData as $month => $targetMrr) {
            $numSubscriptions = floor($targetMrr / $monthlyPrice);
            
            for ($i = 0; $i < min($numSubscriptions, $tenants->count()); $i++) {
                $tenant = $tenants[$i % $tenants->count()];
                
                $existing = DB::table('subscriptions')
                    ->where('tenant_id', $tenant->id)
                    ->whereYear('created_at', substr($month, 0, 4))
                    ->whereMonth('created_at', substr($month, 5, 2))
                    ->where('billing_cycle', 'monthly')
                    ->first();
                    
                if (!$existing) {
                    DB::table('subscriptions')->insert([
                        'tenant_id' => $tenant->id,
                        'plan_id' => rand(1, 4),
                        'price' => $monthlyPrice,
                        'billing_cycle' => 'monthly',
                        'status' => 'active',
                        'stripe_status' => 'active',
                        'starts_at' => now()->setDate(substr($month, 0, 4), substr($month, 5, 2), 1),
                        'ends_at' => now()->setDate(substr($month, 0, 4), substr($month, 5, 2), 1)->addMonth(),
                        'created_at' => now()->setDate(substr($month, 0, 4), substr($month, 5, 2), rand(1, 28)),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Create session requests for session counts
        $this->createSessionHistory();

        // Create credit transactions for CAC calculation
        $this->createCreditTransactions();

        $this->command->info('✓ SuperAdmin Revenue data seeded');
    }

    private function createSessionHistory()
    {
        $teachers = DB::table('users')->where('role', 'teacher')->get();
        $students = DB::table('users')->where('role', 'student')->get();
        
        if ($teachers->isEmpty() || $students->isEmpty()) {
            return;
        }

        // Create historical sessions for last 6 months
        for ($month = 5; $month >= 0; $month--) {
            $numSessions = rand(20, 50);
            
            for ($i = 0; $i < $numSessions; $i++) {
                $teacher = $teachers[rand(0, $teachers->count() - 1)];
                $student = $students[rand(0, $students->count() - 1)];
                
                DB::table('session_requests')->insert([
                    'requester_id' => $student->id,
                    'teacher_id' => $teacher->id,
                    'skill_id' => rand(1, 5),
                    'scheduled_at' => now()->subMonths($month)->addDays(rand(1, 28))->setTime(rand(9, 17), rand(0, 59)),
                    'duration_hours' => rand(1, 4) * 0.5,
                    'status' => 'completed',
                    'credits_held' => rand(1, 5) * 10,
                    'meeting_link' => 'https://meet.skilio.com/' . uniqid(),
                    'created_at' => now()->subMonths($month),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function createCreditTransactions()
    {
        $users = DB::table('users')->where('role', '!=', 'super_admin')->get();
        
        // Create transactions for CAC calculation
        $transactionTypes = ['credit_purchase', 'session_earning', 'session_spending', 'bonus'];
        
        foreach ($users as $user) {
            // Create 5-15 transactions per user
            $numTransactions = rand(5, 15);
            
            for ($i = 0; $i < $numTransactions; $i++) {
                $type = $transactionTypes[array_rand($transactionTypes)];
                $amount = 0;
                
                switch ($type) {
                    case 'credit_purchase':
                        $amount = rand(1, 10) * 10; // 10, 20, 30... 100
                        break;
                    case 'session_earning':
                        $amount = rand(1, 5) * 10; // 10, 20, 30... 50
                        break;
                    case 'session_spending':
                        $amount = -1 * (rand(1, 3) * 10); // -10, -20, -30
                        break;
                    case 'bonus':
                        $amount = rand(5, 20) * 5; // 25, 50, 75, 100
                        break;
                }
                
                DB::table('credit_transactions')->insert([
                    'user_id' => $user->id,
                    'type' => $type,
                    'amount' => $amount,
                    'description' => $this->getTransactionDescription($type, $amount),
                    'reference_type' => $type === 'session_earning' || $type === 'session_spending' ? 'session' : null,
                    'reference_id' => $type === 'session_earning' || $type === 'session_spending' ? rand(1, 100) : null,
                    'created_at' => now()->subDays(rand(1, 180)),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function getTransactionDescription($type, $amount)
    {
        $descriptions = [
            'credit_purchase' => 'Purchased ' . abs($amount) . ' credits',
            'session_earning' => 'Earned ' . abs($amount) . ' credits from teaching session',
            'session_spending' => 'Spent ' . abs($amount) . ' credits on learning session',
            'bonus' => 'Bonus credits for ' . abs($amount),
        ];
        
        return $descriptions[$type] ?? 'Transaction';
    }
}