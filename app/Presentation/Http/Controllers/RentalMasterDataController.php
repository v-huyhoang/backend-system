<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Rental\RentalMasterDataService;
use Illuminate\Http\JsonResponse;

final class RentalMasterDataController extends Controller
{
    public function __construct(
        private readonly RentalMasterDataService $masterData,
    ) {}

    public function propertyTypes(): JsonResponse
    {
        return response()->json([
            'data' => $this->masterData->propertyTypes(),
        ]);
    }

    public function amenities(): JsonResponse
    {
        return response()->json([
            'data' => $this->masterData->amenities(),
        ]);
    }

    public function costTypes(): JsonResponse
    {
        return response()->json([
            'data' => $this->masterData->costTypes(),
        ]);
    }
}
