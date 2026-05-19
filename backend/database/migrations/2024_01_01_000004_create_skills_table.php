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
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->comment('Tenant that owns this skill or context');
            $table->string('name', 255);
            $table->string('category', 100)->comment('e.g., Programming, Language, Academic, Arts');
            $table->text('description')->nullable();
            $table->boolean('is_global')->default(false)->comment('If true, available to all tenants');
            $table->boolean('is_approved')->default(true)->comment('Admin approval status');
            $table->integer('popularity_score')->default(0)->comment('Rank based on usage');
            $table->timestamps();

            $table->unique(['name', 'tenant_id']);
            $table->index('tenant_id');
            $table->index('category');
            $table->index('popularity_score');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
