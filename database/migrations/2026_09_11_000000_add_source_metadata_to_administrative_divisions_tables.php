<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('provinces', function (Blueprint $table) {
            $table->string('source', 50)->default('province_open_api_v2')->after('type');
            $table->json('meta')->nullable()->after('source');
            $table->timestamp('source_synced_at')->nullable()->after('is_active');
        });

        Schema::table('wards', function (Blueprint $table) {
            $table->string('source', 50)->default('province_open_api_v2')->after('type');
            $table->json('meta')->nullable()->after('source');
            $table->timestamp('source_synced_at')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('wards', function (Blueprint $table) {
            $table->dropColumn(['source', 'meta', 'source_synced_at']);
        });

        Schema::table('provinces', function (Blueprint $table) {
            $table->dropColumn(['source', 'meta', 'source_synced_at']);
        });
    }
};
