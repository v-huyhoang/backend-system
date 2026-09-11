<?php

namespace App\Domain\AdministrativeDivision\Models;

use Illuminate\Database\Eloquent\Model;

class AdministrativeDivisionImport extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'source',
        'status',
        'province_count',
        'ward_count',
        'error_message',
        'started_at',
        'finished_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }
}
