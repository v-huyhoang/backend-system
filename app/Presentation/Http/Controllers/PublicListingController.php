<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Rental\DTOs\PublicListingFilters;
use App\Application\Rental\PublicListingService;
use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use App\Presentation\Http\Requests\PublicListings\IndexPublicListingRequest;
use App\Presentation\Http\Resources\PublicListings\PublicListingCollection;
use Inertia\Inertia;
use Inertia\Response;

class PublicListingController extends Controller
{
    public function __construct(
        private readonly PublicListingService $listings,
    ) {}

    public function index(
        IndexPublicListingRequest $request,
        ?Province $province = null,
        ?Ward $ward = null,
    ): Response {
        abort_if($ward && $ward->province_id !== $province?->id, 404);

        $validated = $request->validated();

        return Inertia::render('user/listings/index', [
            'listings' => new PublicListingCollection(
                $this->listings->paginate(
                    PublicListingFilters::fromArray(
                        $validated,
                        $province?->slug,
                        $ward?->slug,
                    ),
                ),
            ),
            'filters' => [
                'location' => $validated['khu-vuc'] ?? $ward?->name ?? $province?->name ?? '',
                'tinh-thanh' => $province?->slug,
                'tinh-thanh-label' => $province?->name,
                'phuong-xa' => $ward?->slug,
                'loai-hinh' => $validated['loai-hinh'] ?? null,
                'gia-tu' => $validated['gia-tu'] ?? null,
                'gia-den' => $validated['gia-den'] ?? null,
                'dien-tich-tu' => $validated['dien-tich-tu'] ?? null,
                'dien-tich-den' => $validated['dien-tich-den'] ?? null,
                'tien-ich' => $validated['tien-ich'] ?? [],
                'sap-xep' => $validated['sap-xep'] ?? 'newest',
            ],
        ]);
    }
}
