<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('merchant_id')->constrained()->restrictOnDelete();
            $table->string('platform', 30)->default('tiktok_shop');
            $table->string('external_product_id', 100)->nullable();
            $table->text('product_url');
            $table->char('currency', 3)->default('VND');
            $table->decimal('reference_price', 15, 2)->nullable();
            $table->decimal('original_price', 15, 2)->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->unsignedBigInteger('sold_count')->nullable();
            $table->boolean('is_in_stock')->default(true);
            $table->string('status', 20)->default('active');
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();

            $table->unique(['platform', 'external_product_id'], 'offers_platform_external_uq');
            $table->index(['product_id', 'status', 'is_in_stock'], 'offers_product_status_idx');
            $table->index(['merchant_id', 'status'], 'offers_merchant_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_offers');
    }
};
