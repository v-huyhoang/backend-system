<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('platform', 30)->default('tiktok');
            $table->string('external_video_id', 100)->nullable();
            $table->string('title', 255);
            $table->text('video_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('status', 20)->default('draft');
            $table->timestamps();

            $table->unique(['platform', 'external_video_id'], 'videos_platform_external_uq');
            $table->index(['status', 'published_at'], 'videos_status_published_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
