<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliate_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_offer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('affiliate_campaign_id')->constrained()->restrictOnDelete();
            $table->text('tracking_url');
            $table->string('external_link_id', 255)->nullable();
            $table->string('status', 20)->default('active');
            $table->unsignedInteger('priority')->default(0);
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_checked_at')->nullable();
            $table->string('last_check_status', 30)->nullable();
            $table->timestamps();

            $table->index(
                ['product_offer_id', 'status', 'priority'],
                'affiliate_links_offer_active_idx'
            );
            $table->index(['status', 'expires_at'], 'affiliate_links_expiration_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_links');
    }
};
