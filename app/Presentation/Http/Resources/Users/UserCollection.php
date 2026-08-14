<?php

namespace App\Presentation\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    /** @var class-string<UserResource> */
    public $collects = UserResource::class;

    /**
     * Keep the pagination structure expected by the current frontend.
     *
     * @param  array<string, mixed>  $paginated
     * @param  array<string, mixed>  $default
     * @return array<string, mixed>
     */
    public function paginationInformation(Request $request, array $paginated, array $default): array
    {
        return [
            'from' => $paginated['from'],
            'to' => $paginated['to'],
            'total' => $paginated['total'],
            'links' => $paginated['links'],
        ];
    }
}
