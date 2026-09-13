<?php

namespace App\Presentation\Http\Controllers;

use App\Domain\Rental\Models\Amenity;
use App\Domain\Rental\Models\ListingCostType;
use App\Domain\Rental\Models\PropertyType;
use Illuminate\Http\JsonResponse;

class RentalMasterDataController extends Controller
{
    public function propertyTypes(): JsonResponse
    {
        return response()->json(['data' => PropertyType::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug'])]);
    }

    public function amenities(): JsonResponse
    {
        return response()->json(['data' => Amenity::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon'])]);
    }

    public function costTypes(): JsonResponse
    {
        return response()->json(['data' => ListingCostType::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'unit'])]);
    }
}
