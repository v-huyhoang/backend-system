<?php

namespace App\Application\Rental\DTOs;

final readonly class StoreLandlordListingData
{
    /**
     * @param  list<int>  $amenityIds
     * @param  list<array{type: string, amount: int|float|null, note: string|null}>  $costs
     */
    public function __construct(
        public int $propertyTypeId,
        public int $wardId,
        public string $title,
        public string $description,
        public string $addressDetail,
        public int|float $monthlyRent,
        public int|float|null $depositAmount,
        public int|float $areaSqm,
        public int $maxOccupants,
        public ?string $availableFrom,
        public string $contactName,
        public string $contactPhone,
        public array $amenityIds,
        public array $costs,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            propertyTypeId: (int) $data['property_type_id'],
            wardId: (int) $data['ward_id'],
            title: $data['title'],
            description: $data['description'],
            addressDetail: $data['address_detail'],
            monthlyRent: $data['monthly_rent'],
            depositAmount: $data['deposit_amount'] ?? null,
            areaSqm: $data['area_sqm'],
            maxOccupants: (int) $data['max_occupants'],
            availableFrom: $data['available_from'] ?? null,
            contactName: $data['contact_name'],
            contactPhone: $data['contact_phone'],
            amenityIds: $data['amenity_ids'] ?? [],
            costs: array_map(
                fn (array $cost): array => [
                    'type' => $cost['type'],
                    'amount' => $cost['amount'] ?? null,
                    'note' => $cost['note'] ?? null,
                ],
                $data['costs'] ?? [],
            ),
        );
    }

    /** @return array<string, int|float|string|null> */
    public function listingAttributes(string $slug): array
    {
        return [
            'property_type_id' => $this->propertyTypeId,
            'ward_id' => $this->wardId,
            'title' => $this->title,
            'slug' => $slug,
            'description' => $this->description,
            'address_detail' => $this->addressDetail,
            'monthly_rent' => $this->monthlyRent,
            'deposit_amount' => $this->depositAmount,
            'area_sqm' => $this->areaSqm,
            'max_occupants' => $this->maxOccupants,
            'available_from' => $this->availableFrom,
            'contact_name' => $this->contactName,
            'contact_phone' => $this->contactPhone,
        ];
    }
}
