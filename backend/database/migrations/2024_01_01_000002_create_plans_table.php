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
        Schema::create('plans', function (Blueprint $table) {
            $table->id()->comment('Primary key');
            $table->string('name', 100)->comment('Plan name: Basic, Pro, Enterprise');
            $table->string('slug', 100)->unique()->comment('URL friendly identifier');
            $table->decimal('price_monthly', 10, 2)->comment('Monthly subscription cost');
            $table->decimal('price_yearly', 10, 2)->nullable()->comment('Yearly subscription cost');
            $table->integer('max_users')->comment('Max users allowed under this plan');
            $table->integer('max_skills_per_user')->default(10)->comment('Limit on skills per student');
            $table->json('features')->comment('JSON blob of plan features');
            $table->string('stripe_price_id', 255)->nullable()->comment('External Stripe price reference');
            $table->boolean('is_active')->default(true)->comment('Availability of the plan');
            $table->integer('sort_order')->default(0)->comment('Order in pricing tables');
            $table->timestamps();

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
