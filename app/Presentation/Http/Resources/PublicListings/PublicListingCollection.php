<?php

namespace App\Presentation\Http\Resources\PublicListings;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PublicListingCollection extends ResourceCollection
{
    /** @var class-string<PublicListingResource> */
    public $collects = PublicListingResource::class;
}
