<?php

namespace App\Application\Rental\DTOs;

final readonly class PublicListingFilters
{
    /** @param list<string> $amenitySlugs */
    public function __construct(
        public ?string $locationKeyword = null,
        public ?string $provinceSlug = null,
        public ?string $wardSlug = null,
        public ?string $propertyTypeSlug = null,
        public ?int $minPrice = null,
        public ?int $maxPrice = null,
        public ?float $minArea = null,
        public ?float $maxArea = null,
        public array $amenitySlugs = [],
        public string $sort = 'newest',
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(
        array $data,
        ?string $provinceSlug = null,
        ?string $wardSlug = null,
    ): self {
        return new self(
            locationKeyword: $data['khu-vuc'] ?? null,
            provinceSlug: $provinceSlug,
            wardSlug: $wardSlug,
            propertyTypeSlug: $data['loai-hinh'] ?? null,
            minPrice: isset($data['gia-tu']) ? (int) $data['gia-tu'] : null,
            maxPrice: isset($data['gia-den']) ? (int) $data['gia-den'] : null,
            minArea: isset($data['dien-tich-tu']) ? (float) $data['dien-tich-tu'] : null,
            maxArea: isset($data['dien-tich-den']) ? (float) $data['dien-tich-den'] : null,
            amenitySlugs: $data['tien-ich'] ?? [],
            sort: $data['sap-xep'] ?? 'newest',
        );
    }

    /** @return array<string, int|float|string|list<string>|null> */
    public function toArray(): array
    {
        return [
            'location_keyword' => $this->locationKeyword,
            'province_slug' => $this->provinceSlug,
            'ward_slug' => $this->wardSlug,
            'property_type_slug' => $this->propertyTypeSlug,
            'min_price' => $this->minPrice,
            'max_price' => $this->maxPrice,
            'min_area' => $this->minArea,
            'max_area' => $this->maxArea,
            'amenity_slugs' => $this->amenitySlugs,
            'sort' => $this->sort,
        ];
    }
}
