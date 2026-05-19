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
        Schema::create('cross_tenant_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('to_tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('from_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('to_user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('credits_amount', 10, 2);
            $table->decimal('platform_fee', 5, 2)->default(0.10)->comment('Default 10% fee');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('transaction_id', 255)->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('from_tenant_id');
            $table->index('to_tenant_id');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cross_tenant_transfers');
    }
};
