<?php

namespace App\Domain\Rental\Models;

use Illuminate\Database\Eloquent\Model;

class ListingCostType extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'name',
        'slug',
        'unit',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
