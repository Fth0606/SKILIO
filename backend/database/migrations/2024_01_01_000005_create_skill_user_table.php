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
        Schema::create('skill_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
            $table->enum('proficiency_level', ['beginner', 'intermediate', 'advanced', 'expert'])->default('intermediate');
            $table->decimal('hourly_rate_credits', 5, 2)->default(1.00)->comment('Credits charged per hour of teaching');
            $table->text('teaching_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('total_sessions_taught')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'skill_id']);
            $table->index('user_id');
            $table->index('skill_id');
            $table->index('proficiency_level');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skill_user');
    }
};
