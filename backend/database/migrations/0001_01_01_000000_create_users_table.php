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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->comment('Owner tenant');
            $table->string('name', 255);
            $table->string('email', 255);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255);
            $table->string('avatar', 500)->nullable();
            $table->string('department', 100)->nullable();
            $table->integer('graduation_year')->nullable();
            $table->text('bio')->nullable();
            $table->decimal('credits_balance', 10, 2)->default(3.00)->comment('Current tradable hours balance');
            $table->decimal('total_credits_earned', 10, 2)->default(0)->comment('Lifetime earnings');
            $table->decimal('total_credits_spent', 10, 2)->default(0)->comment('Lifetime spending');
            $table->integer('total_hours_taught')->default(0);
            $table->integer('total_hours_learned')->default(0);
            $table->decimal('average_rating_as_teacher', 3, 2)->default(0);
            $table->decimal('average_rating_as_student', 3, 2)->default(0);
            $table->enum('role', ['student', 'teacher', 'both', 'tenant_admin', 'super_admin'])->default('student');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->unique(['email', 'tenant_id']);
            $table->index('tenant_id');
            $table->index('role');
            $table->index('credits_balance');
            $table->index('department');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
