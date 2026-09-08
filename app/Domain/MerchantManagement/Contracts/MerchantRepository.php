<?php

namespace App\Domain\MerchantManagement\Contracts;

use App\Domain\MerchantManagement\Models\Merchant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MerchantRepository
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function create(array $attributes): Merchant;

    public function update(Merchant $merchant, array $attributes): Merchant;

    public function delete(Merchant $merchant): void;
}
