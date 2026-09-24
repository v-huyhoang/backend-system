<?php

namespace App\Infrastructure\Persistence\Rental;

use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\Rental\Models\ListingModeration;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

final class EloquentLandlordListingRepository implements LandlordListingRepository
{
    public function details(Listing $listing): Listing
    {
        return $listing->load(['amenities:id', 'costs', 'images', 'ward.province']);
    }

    public function moderationDetails(Listing $listing): Listing
    {
        return $listing->load([
            'landlord:id,name,email',
            'propertyType:id,name',
            'ward.province',
            'amenities:id,name',
            'costs',
            'images',
            'moderations.moderator:id,name',
        ]);
    }

    public function transition(Listing $listing, ListingStatus $status, array $attributes = []): Listing
    {
        $listing->update([...$attributes, 'status' => $status]);

        return $listing->refresh();
    }

    public function addImages(Listing $listing, array $imagePaths): Listing
    {
        $hasPrimaryImage = $listing->images()->where('is_primary', true)->exists();
        $nextSortOrder = (int) $listing->images()->max('sort_order') + 1;

        foreach ($imagePaths as $offset => $path) {
            $listing->images()->create([
                'path' => $path,
                'is_primary' => ! $hasPrimaryImage && $offset === 0,
                'sort_order' => $nextSortOrder + $offset,
            ]);
        }

        return $listing->refresh();
    }

    public function duplicate(Listing $listing, string $slug): Listing
    {
        return DB::transaction(function () use ($listing, $slug): Listing {
            $listing->loadMissing(['amenities', 'costs', 'images']);
            $copy = $listing->replicate(['public_id', 'slug', 'status', 'rejection_reason', 'submitted_at', 'published_at', 'expires_at', 'view_count', 'contact_count']);
            $copy->slug = $slug;
            $copy->status = ListingStatus::Draft;
            $copy->save();
            $copy->amenities()->sync($listing->amenities->pluck('id'));
            $copy->costs()->createMany($listing->costs->map(fn ($cost) => $cost->only(['type', 'label', 'amount', 'unit', 'note', 'sort_order']))->all());
            $copy->images()->createMany($listing->images->map(fn ($image) => $image->only(['path', 'alt_text', 'is_primary', 'sort_order']))->all());

            return $copy;
        });
    }

    public function paginatePendingReview(int $perPage = 10): LengthAwarePaginator
    {
        return Listing::query()
            ->where('status', ListingStatus::PendingReview->value)
            ->with(['landlord:id,name,email', 'ward:id,province_id,name', 'ward.province:id,name', 'primaryImage:id,listing_id,path,alt_text'])
            ->oldest('submitted_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function recentModerations(int $limit = 10): Collection
    {
        return ListingModeration::query()
            ->with(['listing:id,public_id,title', 'moderator:id,name'])
            ->latest('created_at')
            ->limit($limit)
            ->get();
    }

    public function recordModeration(Listing $listing, int $moderatorId, ?ListingStatus $fromStatus, ListingStatus $toStatus, ?string $reason = null, ?array $metadata = null): ListingModeration
    {
        return $listing->moderations()->create([
            'moderator_id' => $moderatorId,
            'from_status' => $fromStatus?->value,
            'to_status' => $toStatus->value,
            'reason' => $reason,
            'metadata' => $metadata,
        ]);
    }

    public function dueForExpiration(): Collection
    {
        return Listing::query()->where('status', ListingStatus::Published)
            ->whereNotNull('expires_at')->where('expires_at', '<=', now())
            ->with('landlord')->get();
    }

    public function updateDraft(Listing $listing, array $listingAttributes, array $amenityIds, array $costs, array $imagePaths): Listing
    {
        return DB::transaction(function () use ($listing, $listingAttributes, $amenityIds, $costs, $imagePaths): Listing {
            $listing->update($listingAttributes);
            $listing->amenities()->sync($amenityIds);
            $listing->costs()->delete();
            $listing->costs()->createMany($costs);

            $hasPrimaryImage = $listing->images()->where('is_primary', true)->exists();
            foreach ($imagePaths as $sortOrder => $path) {
                $listing->images()->create([
                    'path' => $path,
                    'is_primary' => ! $hasPrimaryImage && $sortOrder === 0,
                    'sort_order' => $listing->images()->max('sort_order') + 1,
                ]);
            }

            return $this->details($listing->refresh());
        });
    }

    public function paginateForLandlord(
        int $landlordId,
        ?ListingStatus $status,
        int $perPage = 10,
    ): LengthAwarePaginator {
        return Listing::query()
            ->where('landlord_id', $landlordId)
            ->when($status, fn ($query) => $query->where('status', $status->value))
            ->with([
                'ward:id,province_id,name',
                'ward.province:id,name',
                'primaryImage:id,listing_id,path,alt_text',
                'images:id,listing_id,path,alt_text,is_primary,sort_order',
            ])
            ->latest('updated_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function summaryForLandlord(int $landlordId): array
    {
        $summary = Listing::query()
            ->where('landlord_id', $landlordId)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('COALESCE(SUM(view_count), 0) as view_count')
            ->selectRaw('COALESCE(SUM(contact_count), 0) as contact_count')
            ->selectRaw('COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) as published', [ListingStatus::Published->value])
            ->selectRaw('COALESCE(SUM(CASE WHEN status = ? THEN 1 ELSE 0 END), 0) as rejected', [ListingStatus::Rejected->value])
            ->firstOrFail();

        $statusCounts = Listing::query()
            ->where('landlord_id', $landlordId)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($count): int => (int) $count)
            ->all();

        foreach (ListingStatus::cases() as $status) {
            $statusCounts[$status->value] ??= 0;
        }

        return [
            'published' => (int) $summary->published,
            'view_count' => (int) $summary->view_count,
            'contact_count' => (int) $summary->contact_count,
            'rejected' => (int) $summary->rejected,
            'status_counts' => $statusCounts,
        ];
    }

    public function create(
        int $landlordId,
        array $listingAttributes,
        array $amenityIds,
        array $costs,
    ): Listing {
        return DB::transaction(function () use (
            $landlordId,
            $listingAttributes,
            $amenityIds,
            $costs,
        ): Listing {
            $listing = Listing::query()->create([
                ...$listingAttributes,
                'landlord_id' => $landlordId,
                'status' => ListingStatus::Draft,
            ]);

            $listing->amenities()->sync($amenityIds);
            $listing->costs()->createMany($costs);

            return $listing;
        });
    }
}
