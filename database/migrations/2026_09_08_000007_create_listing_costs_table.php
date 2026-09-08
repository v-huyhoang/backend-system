<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listing_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20);
            $table->string('label', 100);
            $table->decimal('amount', 12)->nullable();
            $table->string('unit', 20);
            $table->string('note', 500)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['listing_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_costs');
    }
};
