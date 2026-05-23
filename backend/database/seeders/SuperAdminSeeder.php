<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuperAdminSeeder extends Seeder
{
    /**
     * Seed all Super Admin data for testing.
     * This creates realistic data for all SuperAdmin pages:
     * - Dashboard/Analytics
     * - Tenant Management
     * - Plans Management
     * - Revenue Analytics
     * - Support Tickets
     */
    public function run(): void
    {
        $this->call([
            SuperAdminPlansSeeder::class,
            SuperAdminTenantsSeeder::class,
            SuperAdminRevenueSeeder::class,
            SuperAdminTicketsSeeder::class,
        ]);
    }
}