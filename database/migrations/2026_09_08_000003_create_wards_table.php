<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained()->restrictOnDelete();
            $table->string('code', 20)->unique();
            $table->string('name');
            $table->string('slug');
            $table->string('type', 20);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['province_id', 'slug']);
            $table->index(['province_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wards');
    }
};
