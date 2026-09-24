<?php

namespace App\Presentation\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ModerationQueueCollection extends ResourceCollection
{
    /** @var class-string<ModerationQueueResource> */
    public $collects = ModerationQueueResource::class;

    /** @return array<string, mixed> */
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
