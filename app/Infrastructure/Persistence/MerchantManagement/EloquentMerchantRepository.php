<?php

namespace App\Infrastructure\Persistence\MerchantManagement;

use App\Domain\MerchantManagement\Contracts\MerchantRepository;
use App\Domain\MerchantManagement\Models\Merchant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentMerchantRepository implements MerchantRepository
{
	public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
	{
		return Merchant::query()
			->when($filters['q'] ?? null, function ($query, string $search) {
				$query->where(function ($query) use ($search) {
					$query->where('name', 'like', "%{$search}%");
				});
			})
			->when(
				$filters['status'] ?? null,
				fn($query, string $status) => $query->where('status', $status),
			)
			->latest()
			->paginate($perPage)
			->withQueryString();
	}

	public function create(array $attributes): Merchant
	{
		return Merchant::create($attributes);
	}

	public function update(Merchant $merchant, array $attributes): Merchant
	{
		$merchant->update($attributes);

		return $merchant->refresh();
	}

	public function delete(Merchant $merchant): void
	{
		$merchant->delete();
	}
}
