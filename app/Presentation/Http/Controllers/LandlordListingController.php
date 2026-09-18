<?php

namespace App\Presentation\Http\Controllers;

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

	public function store(StoreLandlordRequest $request): RedirectResponse
	{
		// Handle the request data and save the landlord listing
		// For example:
		// $landlordListing = LandlordListing::create($request->validated());

		return redirect()->route('landlord.listings.index')->with('success', 'Landlord listing created successfully.');
	}
}
