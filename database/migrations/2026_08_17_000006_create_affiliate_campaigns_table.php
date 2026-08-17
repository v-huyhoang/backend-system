<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliate_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_network_id')->constrained()->restrictOnDelete();
            $table->string('external_campaign_id', 100)->nullable();
            $table->string('name', 200);
            $table->string('commission_type', 20)->nullable();
            $table->decimal('commission_value', 10, 2)->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->unique(
                ['affiliate_network_id', 'external_campaign_id'],
                'campaigns_network_external_uq'
            );
            $table->index(['status', 'starts_at', 'ends_at'], 'campaigns_status_time_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_campaigns');
    }
};
