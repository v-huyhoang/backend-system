<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code', 20)->unique();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('short_description', 500)->nullable();
            $table->longText('content')->nullable();
            $table->string('thumbnail_path', 500)->nullable();
            $table->json('advantages')->nullable();
            $table->json('disadvantages')->nullable();
            $table->json('suitable_for')->nullable();
            $table->json('not_suitable_for')->nullable();
            $table->string('status', 20)->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'status', 'published_at'], 'products_category_status_idx');
            $table->index(['is_featured', 'status', 'sort_order'], 'products_featured_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
