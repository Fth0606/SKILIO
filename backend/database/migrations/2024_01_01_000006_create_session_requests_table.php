<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('session_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->onDelete('cascade')->comment('Student requesting the session');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade')->comment('Teacher offering the skill');
            $table->foreignId('skill_id')->constrained('skills')->comment('The specific skill being traded');
            $table->dateTime('scheduled_at')->comment('Planned session time');
            $table->decimal('duration_hours', 3, 1)->default(1.0)->comment('Length of the session');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed', 'cancelled', 'no_show', 'pending_ratings', 'penalty_applied'])->default('pending');
            $table->boolean('requester_confirmed')->default(false)->comment('Student marked as done');
            $table->boolean('teacher_confirmed')->default(false)->comment('Teacher marked as done');
            $table->boolean('requester_rated')->default(false);
            $table->boolean('teacher_rated')->default(false);
            $table->decimal('credits_held', 5, 2)->default(0)->comment('Amount escrowed for the session');
            $table->string('meeting_link', 500)->nullable();
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->enum('cancelled_by', ['requester', 'teacher', 'system'])->nullable();
            $table->timestamps();

            $table->index('requester_id');
            $table->index('teacher_id');
            $table->index('status');
            $table->index('scheduled_at');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_requests');
    }
};
