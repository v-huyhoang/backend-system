<?php

namespace App\Application\Rental;

use App\Application\Rental\DTOs\LandlordListingFilters;
use App\Application\Rental\DTOs\StoreLandlordListingData;
use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Contracts\ListingImageStorage;
use App\Domain\Rental\Contracts\RentalMasterDataRepository;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use LogicException;

final class LandlordListingService
{
    public function __construct(
        private readonly LandlordListingRepository $listings,
        private readonly RentalMasterDataRepository $rentalMasterData,
        private readonly ListingImageStorage $imageStorage,
    ) {}

    /** @param list<UploadedFile> $images */
    public function create(User $landlord, StoreLandlordListingData $data, array $images = []): Listing
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

        $listing = $this->listings->create(
            landlordId: $landlord->id,
            listingAttributes: $data->listingAttributes($this->makeSlug($data->title)),
            amenityIds: $data->amenityIds,
            costs: $costs,
        );

        if ($images === []) {
            return $listing;
        }

        return $this->listings->addImages($listing, array_map(
            fn (UploadedFile $image): string => $this->imageStorage->store($listing->id, $image),
            $images,
        ));
    }

    public function paginate(User $landlord, LandlordListingFilters $filters): LengthAwarePaginator
    {
        return $this->listings->paginateForLandlord($landlord->id, $filters->status);
    }

    /**
     * @return array{published: int, view_count: int, contact_count: int, rejected: int, status_counts: array<string, int>}
     */
    public function summary(User $landlord): array
    {
        return $this->listings->summaryForLandlord($landlord->id);
    }

    public function details(Listing $listing): Listing
    {
        return $this->listings->details($listing);
    }

    public function submitForReview(Listing $listing): Listing
    {
        if ($listing->status !== ListingStatus::Draft) {
            throw new LogicException('Chỉ có thể gửi duyệt tin ở trạng thái bản nháp.');
        }

        return $this->listings->transition($listing, ListingStatus::PendingReview, [
            'submitted_at' => now(),
            'rejection_reason' => null,
        ]);
    }

    public function hide(Listing $listing): Listing
    {
        return $this->transitionOwnedListing($listing, ListingStatus::Published, ListingStatus::Hidden);
    }

    public function markAsRented(Listing $listing): Listing
    {
        return $this->transitionOwnedListing($listing, ListingStatus::Published, ListingStatus::Rented);
    }

    public function renew(Listing $listing): Listing
    {
        return $this->transitionOwnedListing($listing, ListingStatus::Expired, ListingStatus::PendingReview, [
            'submitted_at' => now(),
        ]);
    }

    public function duplicate(Listing $listing): Listing
    {
        return $this->listings->duplicate($listing, $this->makeSlug($listing->title));
    }

    /** @param list<UploadedFile> $images */
    public function updateDraft(Listing $listing, StoreLandlordListingData $data, array $images): Listing
    {
        if ($listing->status !== ListingStatus::Draft) {
            throw new LogicException('Chỉ có thể chỉnh sửa tin ở trạng thái bản nháp.');
        }

        $imagePaths = array_map(
            fn (UploadedFile $image): string => $this->imageStorage->store($listing->id, $image),
            $images,
        );

        return $this->listings->updateDraft(
            $listing,
            $data->listingAttributes($listing->slug),
            $data->amenityIds,
            $this->normalizedCosts($data),
            $imagePaths,
        );
    }

    private function normalizedCosts(StoreLandlordListingData $data): array
    {
        $costTypes = $this->rentalMasterData->getCostTypes()->keyBy('slug');

        return array_map(function (array $cost, int $sortOrder) use ($costTypes): array {
            $costType = $costTypes->get($cost['type']);

            if ($costType === null) {
                throw new LogicException('Chi phí không còn được hỗ trợ.');
            }

            return ['type' => $costType->slug, 'label' => $costType->name, 'amount' => $cost['amount'], 'unit' => $costType->unit, 'note' => $cost['note'], 'sort_order' => $sortOrder];
        }, $data->costs, array_keys($data->costs));
    }

    /** @param array<string, mixed> $attributes */
    private function transitionOwnedListing(Listing $listing, ListingStatus $from, ListingStatus $to, array $attributes = []): Listing
    {
        if ($listing->status !== $from) {
            throw new LogicException('Tin đăng không ở trạng thái hợp lệ cho thao tác này.');
        }

        return $this->listings->transition($listing, $to, $attributes);
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
