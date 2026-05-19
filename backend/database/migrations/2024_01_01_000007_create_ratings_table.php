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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_request_id')->constrained('session_requests')->onDelete('cascade');
            $table->foreignId('rater_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rated_id')->constrained('users')->onDelete('cascade');
            $table->unsignedTinyInteger('score')->comment('1-5 rating');
            $table->text('comment')->nullable();
            $table->json('tags')->nullable()->comment('e.g., ["punctual", "knowledgeable"]');
            $table->timestamp('created_at')->nullable();

            $table->unique(['session_request_id', 'rater_id']);
            $table->index('session_request_id');
            $table->index('rater_id');
            $table->index('rated_id');
            $table->index('score');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
        
        // Add check constraint if supported by the driver, or rely on validation. 
        // Note: Laravel Blueprint doesn't have a check() method for all DBs, 
        // but we'll include the logic in comments as per standard practice.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
