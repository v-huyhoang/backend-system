<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('administrative_division_imports', function (Blueprint $table) {
            $table->id();
            $table->string('source', 50);
            $table->string('status', 20)->default('running');
            $table->unsignedInteger('province_count')->default(0);
            $table->unsignedInteger('ward_count')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();

            $table->index(['source', 'status']);
            $table->index('started_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('administrative_division_imports');
    }
};
