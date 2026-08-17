<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')
                ->default(0)
                ->after('parent_id')
                ->comment('Order among categories with the same parent');

            $table->index(['parent_id', 'sort_order']);
        });

        $sortOrders = [];

        DB::table('categories')
            ->select(['id', 'parent_id'])
            ->orderBy('id')
            ->get()
            ->each(function (object $category) use (&$sortOrders): void {
                $parentKey = $category->parent_id ?? 'root';
                $sortOrders[$parentKey] = ($sortOrders[$parentKey] ?? 0) + 1;

                DB::table('categories')
                    ->where('id', $category->id)
                    ->update(['sort_order' => $sortOrders[$parentKey]]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
