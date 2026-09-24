<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Rental\ListingModerationService;
use App\Domain\Rental\Models\Listing;
use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\UserManagement\Models\User;
use App\Presentation\Http\Requests\Admin\RejectListingRequest;
use App\Presentation\Http\Resources\Admin\ModerationActivityResource;
use App\Presentation\Http\Resources\Admin\ModerationListingDetailResource;
use App\Presentation\Http\Resources\Admin\ModerationQueueCollection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListingModerationController extends Controller
{
    public function index(ListingModerationService $moderation): Response
    {
        return Inertia::render('admin/dashboard', [
            'pendingListings' => new ModerationQueueCollection($moderation->pendingReview()),
            'recentActivity' => ModerationActivityResource::collection($moderation->recentActivity()),
            'canReview' => request()->user()?->can(SystemPermission::ReviewListings->value) ?? false,
        ]);
    }

    public function show(Listing $listing, ListingModerationService $moderation): Response
    {
        return Inertia::render('admin/listings/show', [
            'listing' => (new ModerationListingDetailResource($moderation->details($listing)))->resolve(),
            'canReview' => request()->user()?->can(SystemPermission::ReviewListings->value) ?? false,
        ]);
    }

    public function approve(Request $request, Listing $listing, ListingModerationService $moderation): RedirectResponse
    {
        /** @var User $moderator */
        $moderator = $request->user();
        $moderation->approve($moderator, $listing);

        return back()->with('success', 'Tin đăng đã được duyệt và lưu audit log.');
    }

    public function reject(RejectListingRequest $request, Listing $listing, ListingModerationService $moderation): RedirectResponse
    {
        /** @var User $moderator */
        $moderator = $request->user();
        $moderation->reject($moderator, $listing, $request->validated('reason'));

        return back()->with('success', 'Tin đăng đã được trả về và lưu audit log.');
    }
}
