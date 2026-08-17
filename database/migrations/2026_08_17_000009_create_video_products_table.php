<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('video_products', function (Blueprint $table) {
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['video_id', 'product_id']);
            $table->index(['product_id', 'video_id'], 'video_products_product_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_products');
    }
};
