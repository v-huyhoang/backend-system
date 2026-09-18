<?php

namespace App\Application\Rental;

use App\Application\Rental\DTOs\StoreLandlordListingData;
use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;
use Illuminate\Support\Str;
use LogicException;

final class LandlordListingService
{
    public function __construct(
        private readonly LandlordListingRepository $listings,
        private readonly RentalMasterDataRepository $rentalMasterData,
    ) {}

    public function create(User $landlord, StoreLandlordListingData $data): Listing
    {
        $costTypes = $this->rentalMasterData->getCostTypes()->keyBy('slug');
        $costs = array_map(
            function (array $cost, int $sortOrder) use ($costTypes): array {
                $costType = $costTypes->get($cost['type']);

                if ($costType === null) {
                    throw new LogicException('Chi phí không còn được hỗ trợ.');
                }

                return [
                    'type' => $costType->slug,
                    'label' => $costType->name,
                    'amount' => $cost['amount'],
                    'unit' => $costType->unit,
                    'note' => $cost['note'],
                    'sort_order' => $sortOrder,
                ];
            },
            $data->costs,
            array_keys($data->costs),
        );

        return $this->listings->create(
            landlordId: $landlord->id,
            listingAttributes: $data->listingAttributes($this->makeSlug($data->title)),
            amenityIds: $data->amenityIds,
            costs: $costs,
        );
    }

    private function makeSlug(string $title): string
    {
        $base = Str::limit(Str::slug($title), 228, '');

        return sprintf(
            '%s-%s',
            $base !== '' ? $base : 'listing',
            Str::lower((string) Str::ulid()),
        );
    }
}
