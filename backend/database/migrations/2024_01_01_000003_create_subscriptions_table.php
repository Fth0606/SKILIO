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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->comment('Reference to the tenant');
            $table->foreignId('plan_id')->constrained('plans')->comment('Reference to the subscribed plan');
            $table->string('stripe_id', 255)->nullable()->comment('Stripe subscription ID');
            $table->string('stripe_status', 50)->nullable()->comment('Status from Stripe (active, trialing, etc)');
            $table->string('stripe_price', 255)->nullable()->comment('Stripe price ID used');
            $table->integer('quantity')->default(1)->comment('Number of seats or units');
            $table->timestamp('trial_ends_at')->nullable()->comment('Trial expiration date');
            $table->timestamp('ends_at')->nullable()->comment('Subscription expiration date');
            $table->timestamps();

            $table->index('tenant_id');
            $table->index('stripe_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
