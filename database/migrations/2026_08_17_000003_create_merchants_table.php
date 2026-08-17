<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 30)->default('tiktok_shop');
            $table->string('external_merchant_id', 100)->nullable();
            $table->string('name', 200);
            $table->text('shop_url')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->unique(['platform', 'external_merchant_id'], 'merchants_platform_external_uq');
            $table->index(['platform', 'status'], 'merchants_platform_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('merchants');
    }
};
