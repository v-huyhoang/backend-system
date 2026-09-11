<?php

namespace App\Presentation\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LandlordListingController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('user/landlord-listings/index');
    }

    public function create(): Response
    {
        return Inertia::render('user/landlord-listings/create');
    }
}
