<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupportTicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->where('role', '!=', 'super_admin')->take(10)->get();

        foreach ($users as $user) {
            DB::table('support_tickets')->insert([
                'tenant_id' => $user->tenant_id,
                'user_id' => $user->id,
                'subject' => 'Issue with session booking',
                'message' => 'I cannot find the meeting link for my upcoming session.',
                'status' => 'open',
                'priority' => 'medium',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
