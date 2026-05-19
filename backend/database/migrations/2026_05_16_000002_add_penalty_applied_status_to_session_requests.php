<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE session_requests MODIFY COLUMN status ENUM(
            'pending', 'accepted', 'rejected', 'completed', 'cancelled', 'no_show', 'pending_ratings', 'penalty_applied'
        ) NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE session_requests MODIFY COLUMN status ENUM(
            'pending', 'accepted', 'rejected', 'completed', 'cancelled', 'no_show', 'pending_ratings'
        ) NOT NULL DEFAULT 'pending'");
    }
};
