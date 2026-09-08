<?php

namespace App\Application\MerchantManagement;

use App\Application\MerchantManagement\DTOs\StoreMerchantData;
use App\Application\MerchantManagement\DTOs\UpdateMerchantData;
use App\Domain\MerchantManagement\Contracts\MerchantRepository;
use App\Domain\MerchantManagement\Models\Merchant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MerchantService
{
    public function __construct(private readonly MerchantRepository $merchants) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->merchants->paginate($filters);
    }

    public function create(StoreMerchantData $data): Merchant
    {
        return $this->merchants->create($data->toArray());
    }

    public function update(Merchant $merchant, UpdateMerchantData $data): Merchant
    {
        return $this->merchants->update($merchant, $data->toArray());
    }

    public function delete(Merchant $merchant): void
    {
        $this->merchants->delete($merchant);
    }
}
