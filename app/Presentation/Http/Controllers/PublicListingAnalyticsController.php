<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Rental\PublicListingService;
use App\Domain\Rental\Models\Listing;
use Illuminate\Http\Response;

class PublicListingAnalyticsController extends Controller
{
    public function view(Listing $listing, PublicListingService $listings): Response
    {
        $listings->recordView($listing);

        return response()->noContent();
    }

    public function contact(Listing $listing, PublicListingService $listings): Response
    {
        $listings->recordContact($listing);

        return response()->noContent();
    }
}
