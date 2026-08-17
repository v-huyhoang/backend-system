<?php

namespace App\Presentation\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    /** @var class-string<ProductResource> */
    public $collects = ProductResource::class;

    /**
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
