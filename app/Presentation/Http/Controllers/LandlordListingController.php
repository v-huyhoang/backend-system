<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Rental\DTOs\StoreLandlordListingData;
use App\Application\Rental\LandlordListingService;
use App\Domain\UserManagement\Models\User;
use App\Presentation\Http\Requests\Landlord\StoreLandlordRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LandlordListingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('landlord/listings/index');
    }

    public function create(): Response
    {
        return Inertia::render('landlord/listings/create');
    }

    public function store(
        StoreLandlordRequest $request,
        LandlordListingService $listings,
    ): RedirectResponse {
        /** @var User $landlord */
        $landlord = $request->user();

        $listings->create(
            $landlord,
            StoreLandlordListingData::fromArray($request->validated()),
        );

        return to_route('landlord.listings.index')
            ->with('success', 'Tin đăng đã được lưu ở trạng thái bản nháp.');
    }
}
