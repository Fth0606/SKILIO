<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserExtraSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = DB::table('tenants')->get();
        
        foreach ($tenants as $tenant) {
            // Add 2 more students
            for ($i = 1; $i <= 2; $i++) {
                DB::table('users')->insertOrIgnore([
                    'tenant_id' => $tenant->id,
                    'name' => "Student {$i} " . $tenant->name,
                    'email' => "student{$i}@{$tenant->subdomain}.edu",
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'credits_balance' => 10.00,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Add 2 teachers
            for ($i = 1; $i <= 2; $i++) {
                DB::table('users')->insertOrIgnore([
                    'tenant_id' => $tenant->id,
                    'name' => "Teacher {$i} " . $tenant->name,
                    'email' => "teacher{$i}@{$tenant->subdomain}.edu",
                    'password' => Hash::make('password'),
                    'role' => 'teacher',
                    'credits_balance' => 0.00,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
