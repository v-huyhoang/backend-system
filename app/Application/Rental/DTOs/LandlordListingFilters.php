<?php

namespace App\Application\Rental\DTOs;

use App\Domain\Rental\Enums\ListingStatus;

final readonly class LandlordListingFilters
{
    public function __construct(public ?ListingStatus $status) {}

    /** @param array{status?: string} $data */
    public static function fromArray(array $data): self
    {
        return new self(
            status: isset($data['status'])
                ? ListingStatus::tryFrom($data['status'])
                : null,
        );
    }

    /** @return array{status?: string} */
    public function toArray(): array
    {
        return $this->status === null ? [] : ['status' => $this->status->value];
    }
}
