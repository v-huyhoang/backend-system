<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliate_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_link_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('affiliate_network_id')->constrained()->restrictOnDelete();
            $table->string('external_conversion_id', 255);
            $table->string('external_order_id', 255)->nullable();
            $table->char('currency', 3)->default('VND');
            $table->decimal('order_value', 15, 2)->nullable();
            $table->decimal('commission_value', 15, 2)->default(0);
            $table->string('status', 20)->default('pending');
            $table->timestamp('ordered_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->string('rejection_reason', 500)->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamps();

            $table->unique(
                ['affiliate_network_id', 'external_conversion_id'],
                'conversions_network_external_uq'
            );
            $table->index(['status', 'ordered_at'], 'conversions_status_ordered_idx');
            $table->index(['affiliate_link_id', 'status'], 'conversions_link_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_conversions');
    }
};
