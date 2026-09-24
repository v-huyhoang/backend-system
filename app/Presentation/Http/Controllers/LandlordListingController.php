<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Rental\DTOs\LandlordListingFilters;
use App\Application\Rental\DTOs\StoreLandlordListingData;
use App\Application\Rental\LandlordListingService;
use App\Domain\Rental\Models\Listing;
use App\Domain\UserManagement\Models\User;
use App\Presentation\Http\Requests\Landlord\IndexLandlordListingRequest;
use App\Presentation\Http\Requests\Landlord\StoreLandlordRequest;
use App\Presentation\Http\Requests\Landlord\UpdateLandlordListingRequest;
use App\Presentation\Http\Resources\LandlordListings\LandlordListingCollection;
use App\Presentation\Http\Resources\LandlordListings\LandlordListingEditResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LandlordListingController extends Controller
{
    public function index(
        IndexLandlordListingRequest $request,
        LandlordListingService $listings,
    ): Response {
        /** @var User $landlord */
        $landlord = $request->user();
        $filters = LandlordListingFilters::fromArray($request->validated());

        return Inertia::render('landlord/listings/index', [
            'listings' => new LandlordListingCollection($listings->paginate($landlord, $filters)),
            'summary' => $listings->summary($landlord),
            'filters' => $filters->toArray(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('landlord/listings/create');
    }

    public function edit(Listing $listing, LandlordListingService $listings): Response
    {
        return Inertia::render('landlord/listings/edit', [
            'listing' => new LandlordListingEditResource($listings->details($listing)),
        ]);
    }

    public function update(UpdateLandlordListingRequest $request, Listing $listing, LandlordListingService $listings): RedirectResponse
    {
        $listings->updateDraft($listing, StoreLandlordListingData::fromArray($request->validated()), $request->file('images', []));

        return to_route('landlord.listings.edit', $listing->public_id)->with('success', 'Bản nháp đã được cập nhật.');
    }

    public function submit(Listing $listing, LandlordListingService $listings): RedirectResponse
    {
        $listings->submitForReview($listing);

        return to_route('landlord.listings.index')->with('success', 'Tin đăng đã được gửi duyệt.');
    }

    public function hide(Listing $listing, LandlordListingService $listings): RedirectResponse
    {
        $listings->hide($listing);

        return back()->with('success', 'Tin đăng đã được ẩn.');
    }

    public function markAsRented(Listing $listing, LandlordListingService $listings): RedirectResponse
    {
        $listings->markAsRented($listing);

        return back()->with('success', 'Tin đăng đã được đánh dấu đã cho thuê.');
    }

    public function renew(Listing $listing, LandlordListingService $listings): RedirectResponse
    {
        $listings->renew($listing);

        return back()->with('success', 'Tin đăng đã được gửi duyệt gia hạn.');
    }

    public function duplicate(Listing $listing, LandlordListingService $listings): RedirectResponse
    {
        $copy = $listings->duplicate($listing);

        return to_route('landlord.listings.edit', $copy->public_id)
            ->with('success', 'Đã tạo bản sao tin đăng.');
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
            $request->file('images', []),
        );

        return to_route('landlord.listings.index')
            ->with('success', 'Tin đăng đã được lưu ở trạng thái bản nháp.');
    }
}
