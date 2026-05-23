<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuperAdminRevenueSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = DB::table('tenants')->get();
        
        if ($tenants->isEmpty()) return;

        // Create historical subscriptions
        $monthlyPrice = 99;
        $mrrData = [
            now()->subMonths(5)->format('Y-m') => 12500,
            now()->subMonths(4)->format('Y-m') => 15800,
            now()->subMonths(3)->format('Y-m') => 18200,
            now()->subMonths(2)->format('Y-m') => 21500,
            now()->subMonths(1)->format('Y-m') => 24800,
            now()->format('Y-m') => 28400,
        ];

        foreach ($mrrData as $month => $targetMrr) {
            $numSubscriptions = floor($targetMrr / $monthlyPrice);
            for ($i = 0; $i < min($numSubscriptions, $tenants->count()); $i++) {
                $tenant = $tenants[$i % $tenants->count()];
                if (!DB::table('subscriptions')->where('tenant_id', $tenant->id)->whereYear('created_at', substr($month, 0, 4))->whereMonth('created_at', substr($month, 5, 2))->exists()) {
                    DB::table('subscriptions')->insert([
                        'tenant_id' => $tenant->id, 'plan_id' => rand(1, 4), 'price' => $monthlyPrice,
                        'billing_cycle' => 'monthly', 'status' => 'active', 'stripe_status' => 'active',
                        'starts_at' => now()->setDate(substr($month, 0, 4), substr($month, 5, 2), 1),
                        'ends_at' => now()->setDate(substr($month, 0, 4), substr($month, 5, 2), 1)->addMonth(),
                        'created_at' => now()->setDate(substr($month, 0, 4), substr($month, 5, 2), rand(1, 28)),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $this->createSessionHistory();
        $this->createCreditTransactions();
        $this->command->info('✓ SuperAdmin Revenue data seeded');
    }

    private function createSessionHistory()
    {
        $teachers = DB::table('users')->where('role', 'teacher')->get();
        $students = DB::table('users')->where('role', 'student')->get();
        if ($teachers->isEmpty() || $students->isEmpty()) return;

        for ($month = 5; $month >= 0; $month--) {
            $numSessions = rand(20, 50);
            for ($i = 0; $i < $numSessions; $i++) {
                $teacher = $teachers[rand(0, $teachers->count() - 1)];
                $student = $students[rand(0, $students->count() - 1)];
                DB::table('session_requests')->insert([
                    'requester_id' => $student->id, 'teacher_id' => $teacher->id, 'skill_id' => rand(1, 5),
                    'scheduled_at' => now()->subMonths($month)->addDays(rand(1, 28))->setTime(rand(9, 17), rand(0, 59)),
                    'duration_hours' => rand(1, 4) * 0.5, 'status' => 'completed',
                    'credits_held' => rand(1, 5) * 10, 'meeting_link' => 'https://meet.skilio.com/' . uniqid(),
                    'created_at' => now()->subMonths($month), 'updated_at' => now(),
                ]);
            }
        }
    }

    private function createCreditTransactions()
    {
        $users = DB::table('users')->where('role', '!=', 'super_admin')->get();
        $types = ['earn', 'spend', 'bonus', 'refund'];
        
        foreach ($users as $user) {
            $currentBalance = $user->credits_balance ?? 100;
            for ($i = 0; $i < rand(5, 15); $i++) {
                $type = $types[array_rand($types)];
                $amount = match($type) {
                    'earn' => (float) rand(1, 5) * 10,
                    'spend' => -1 * (float) rand(1, 3) * 10,
                    'bonus' => (float) rand(5, 20) * 5,
                    'refund' => (float) rand(1, 3) * 10,
                };
                $currentBalance += $amount;
                
                DB::table('credit_transactions')->insert([
                    'user_id' => $user->id,
                    'session_request_id' => null,
                    'amount' => $amount,
                    'balance_after' => max(0, $currentBalance),
                    'type' => $type,
                    'description' => match($type) {
                        'earn' => 'Earned from teaching session',
                        'spend' => 'Spent on learning session',
                        'bonus' => 'Bonus credits awarded',
                        'refund' => 'Refund issued',
                    },
                    'metadata' => null,
                    'created_at' => now()->subDays(rand(1, 180)),
                ]);
            }
        }
    }
}