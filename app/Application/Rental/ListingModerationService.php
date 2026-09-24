<?php

namespace App\Application\Rental;

use App\Domain\Rental\Contracts\LandlordListingRepository;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use LogicException;

final class ListingModerationService
{
    public function __construct(private readonly LandlordListingRepository $listings) {}

    public function approve(User $moderator, Listing $listing): Listing
    {
        $this->ensurePendingReview($listing);

        return $this->moderate($moderator, $listing, ListingStatus::Published, null, [
            'rejection_reason' => null,
            'published_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);
    }

    public function reject(User $moderator, Listing $listing, string $reason): Listing
    {
        $this->ensurePendingReview($listing);

        return $this->moderate($moderator, $listing, ListingStatus::Rejected, $reason, [
            'rejection_reason' => $reason,
        ]);
    }

    public function pendingReview(): LengthAwarePaginator
    {
        return $this->listings->paginatePendingReview();
    }

    public function details(Listing $listing): Listing
    {
        return $this->listings->moderationDetails($listing);
    }

    /** @return Collection<int, \App\Domain\Rental\Models\ListingModeration> */
    public function recentActivity(): Collection
    {
        return $this->listings->recentModerations();
    }

    /** @param array<string, mixed> $attributes */
    private function moderate(User $moderator, Listing $listing, ListingStatus $toStatus, ?string $reason, array $attributes): Listing
    {
        return DB::transaction(function () use ($moderator, $listing, $toStatus, $reason, $attributes): Listing {
            $fromStatus = $listing->status;
            $updated = $this->listings->transition($listing, $toStatus, $attributes);
            $this->listings->recordModeration($updated, $moderator->id, $fromStatus, $toStatus, $reason);

            return $updated;
        });
    }

    private function ensurePendingReview(Listing $listing): void
    {
        if ($listing->status !== ListingStatus::PendingReview) {
            throw new LogicException('Tin đăng không ở trạng thái chờ duyệt.');
        }
    }
}
