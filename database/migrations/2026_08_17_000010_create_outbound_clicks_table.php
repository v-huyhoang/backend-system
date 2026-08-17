<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('outbound_clicks', function (Blueprint $table) {
            $table->id();
            $table->uuid('event_uuid')->unique();
            $table->foreignId('affiliate_link_id')->constrained()->restrictOnDelete();
            $table->foreignId('video_id')->nullable()->constrained()->nullOnDelete();
            $table->char('session_hash', 64)->nullable();
            $table->char('ip_hash', 64)->nullable();
            $table->char('user_agent_hash', 64)->nullable();
            $table->string('source', 50)->nullable();
            $table->string('medium', 50)->nullable();
            $table->string('campaign', 100)->nullable();
            $table->string('placement', 50)->nullable();
            $table->string('referrer_host', 255)->nullable();
            $table->timestamp('clicked_at', precision: 3);

            $table->index(['affiliate_link_id', 'clicked_at'], 'clicks_link_time_idx');
            $table->index(['video_id', 'clicked_at'], 'clicks_video_time_idx');
            $table->index(['source', 'clicked_at'], 'clicks_source_time_idx');
            $table->index('clicked_at', 'clicks_time_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outbound_clicks');
    }
};
