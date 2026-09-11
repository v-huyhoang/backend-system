<?php

namespace App\Domain\Rental\Enums;

enum ListingStatus: string
{
    case Draft = 'draft';
    case PendingReview = 'pending_review';
    case Published = 'published';
    case Rejected = 'rejected';
    case Hidden = 'hidden';
    case Rented = 'rented';
    case Expired = 'expired';

    public function isPublic(): bool
    {
        return $this === self::Published;
    }
}
