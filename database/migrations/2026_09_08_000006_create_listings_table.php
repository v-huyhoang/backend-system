<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('landlord_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('property_type_id')->constrained()->restrictOnDelete();
            $table->foreignId('ward_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('address_detail', 500);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('monthly_rent', 12);
            $table->decimal('deposit_amount', 12)->nullable();
            $table->decimal('area_sqm', 7, 2);
            $table->unsignedSmallInteger('max_occupants')->default(1);
            $table->date('available_from')->nullable();
            $table->string('contact_name');
            $table->string('contact_phone', 20);
            $table->string('status', 20)->default('draft');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('contact_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index(['status', 'ward_id', 'monthly_rent']);
            $table->index(['landlord_id', 'status']);
            $table->index(['property_type_id', 'status']);
            $table->index(['status', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
