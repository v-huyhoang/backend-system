<?php

use App\Domain\UserManagement\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const OLD_USER_TYPE = 'App\\Models\\User';

    public function up(): void
    {
        $this->replaceModelType(self::OLD_USER_TYPE, User::class);
    }

    public function down(): void
    {
        $this->replaceModelType(User::class, self::OLD_USER_TYPE);
    }

    private function replaceModelType(string $from, string $to): void
    {
        DB::transaction(function () use ($from, $to) {
            DB::table(config('permission.table_names.model_has_roles'))
                ->where('model_type', $from)
                ->update(['model_type' => $to]);

            DB::table(config('permission.table_names.model_has_permissions'))
                ->where('model_type', $from)
                ->update(['model_type' => $to]);
        });
    }
};
