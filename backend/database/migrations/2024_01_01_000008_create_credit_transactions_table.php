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
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('session_request_id')->nullable()->constrained('session_requests')->onDelete('set null');
            $table->decimal('amount', 10, 2)->comment('Positive = earned, Negative = spent');
            $table->decimal('balance_after', 10, 2)->comment('Balance following this transaction');
            $table->enum('type', ['earn', 'spend', 'bonus', 'penalty', 'refund', 'admin_adjustment']);
            $table->string('description', 500);
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('user_id');
            $table->index('session_request_id');
            $table->index('type');
            $table->index('created_at');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
    }
};
