<?php

namespace App\Presentation\Http\Controllers;

use App\Application\AdministrativeDivision\AdministrativeDivisionDirectoryService;
use App\Domain\AdministrativeDivision\Models\Province;
use App\Presentation\Http\Requests\AdministrativeDivisions\SearchLocationSuggestionRequest;
use Illuminate\Http\JsonResponse;

class LocationSuggestionController extends Controller
{
    public function __construct(private readonly AdministrativeDivisionDirectoryService $divisions) {}

    public function index(SearchLocationSuggestionRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->divisions->searchActiveLocations($request->string('q')->trim()->toString()),
        ]);
    }

    public function wards(Province $province): JsonResponse
    {
        abort_unless($province->is_active, 404);

        return response()->json([
            'data' => $this->divisions->activeWardSuggestionsForProvince($province),
        ]);
    }

    public function provinces(): JsonResponse
    {
        return response()->json([
            'data' => $this->divisions->activeProvinceOptions()->map(
                fn (array $province) => [
                    'id' => $province['id'],
                    'label' => $province['label'],
                    'url' => "/phong-tro/tinh-thanh/{$province['slug']}",
                    'type' => 'Tỉnh/thành',
                ],
            )->values(),
        ]);
    }
}
