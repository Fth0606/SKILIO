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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id()->comment('Primary key: Unique identifier for each tenant');
            $table->string('name', 255)->comment('School/University name');
            $table->string('subdomain', 100)->unique()->comment('Tenant subdomain e.g., harvard');
            $table->string('email', 255)->comment('Admin contact email');
            $table->string('logo_url', 500)->nullable()->comment('URL to tenant logo');
            $table->string('primary_color', 7)->default('#0F6E56')->comment('Primary branding color');
            $table->string('secondary_color', 7)->default('#10B981')->comment('Secondary branding color');
            $table->text('custom_css')->nullable()->comment('Custom CSS overrides for the tenant');
            $table->integer('max_users')->default(200)->comment('Maximum number of users allowed');
            $table->boolean('is_active')->default(true)->comment('Status of the tenant');
            $table->timestamp('subscription_ends_at')->nullable()->comment('Date when subscription expires');
            $table->timestamp('trial_ends_at')->nullable()->comment('Date when trial ends');
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
        Schema::dropIfExists('tenants');
    }
};
