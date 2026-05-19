<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Call the seeder to populate the plans table
        Artisan::call('db:seed', [
            '--class' => 'PlanSeeder',
            '--force' => true
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally truncate the plans table
        // DB::table('plans')->truncate();
    }
};
