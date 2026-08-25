<?php

namespace App\Presentation\Http\Controllers;

use App\Domain\ProductManagement\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductOfferController extends Controller
{
    public function index(Product $product): Response
    {
        $offers = DB::table('product_offers')
            ->join('merchants', 'merchants.id', '=', 'product_offers.merchant_id')
            ->where('product_offers.product_id', $product->id)
            ->select('product_offers.*', 'merchants.name as merchant_name')
            ->orderByDesc('product_offers.is_in_stock')
            ->orderBy('product_offers.reference_price')
            ->get();

        return Inertia::render('admin/products/offers/index', [
            'product' => $product->only(['id', 'name', 'code']),
            'offers' => $offers,
        ]);
    }
}
