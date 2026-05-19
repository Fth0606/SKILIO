<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreditTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->where('role', 'student')->get();

        foreach ($users as $user) {
            DB::table('credit_transactions')->insert([
                'user_id' => $user->id,
                'amount' => 5.00,
                'balance_after' => $user->credits_balance,
                'type' => 'bonus',
                'description' => 'Welcome bonus credits',
                'created_at' => now()->subDays(10),
            ]);
        }
    }
}
