<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('session_requests', 'requester_confirmed')) {
            Schema::table('session_requests', function (Blueprint $table) {
                $table->boolean('requester_confirmed')->default(false)->after('status');
            });
        }
        if (!Schema::hasColumn('session_requests', 'teacher_confirmed')) {
            Schema::table('session_requests', function (Blueprint $table) {
                $table->boolean('teacher_confirmed')->default(false)->after('requester_confirmed');
            });
        }
    }

    public function down(): void
    {
        Schema::table('session_requests', function (Blueprint $table) {
            $table->dropColumn(['requester_confirmed', 'teacher_confirmed']);
        });
    }
};
