<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('session_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('session_requests', 'meeting_place_title')) {
                $table->string('meeting_place_title')->nullable()->after('meeting_link');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_address')) {
                $table->string('meeting_place_address', 500)->nullable()->after('meeting_place_title');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_map_link')) {
                $table->string('meeting_place_map_link', 500)->nullable()->after('meeting_place_address');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_room')) {
                $table->string('meeting_place_room', 120)->nullable()->after('meeting_place_map_link');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_notes')) {
                $table->text('meeting_place_notes')->nullable()->after('meeting_place_room');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_status')) {
                $table->enum('meeting_place_status', ['proposed', 'accepted', 'changed'])->nullable()->after('meeting_place_notes');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_proposed_by')) {
                $table->enum('meeting_place_proposed_by', ['requester', 'teacher'])->nullable()->after('meeting_place_status');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_change_reason')) {
                $table->text('meeting_place_change_reason')->nullable()->after('meeting_place_proposed_by');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_history')) {
                $table->json('meeting_place_history')->nullable()->after('meeting_place_change_reason');
            }
            if (!Schema::hasColumn('session_requests', 'meeting_place_updated_at')) {
                $table->dateTime('meeting_place_updated_at')->nullable()->after('meeting_place_history');
            }
        });
    }

    public function down(): void
    {
        Schema::table('session_requests', function (Blueprint $table) {
            $table->dropColumn([
                'meeting_place_title',
                'meeting_place_address',
                'meeting_place_map_link',
                'meeting_place_room',
                'meeting_place_notes',
                'meeting_place_status',
                'meeting_place_proposed_by',
                'meeting_place_change_reason',
                'meeting_place_history',
                'meeting_place_updated_at',
            ]);
        });
    }
};
