<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('price', 10, 2)->default(0)->after('quantity');
            $table->string('billing_cycle', 20)->default('monthly')->after('price');
            $table->string('status', 20)->default('active')->after('billing_cycle');
            $table->timestamp('starts_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['price', 'billing_cycle', 'status', 'starts_at']);
        });
    }
};