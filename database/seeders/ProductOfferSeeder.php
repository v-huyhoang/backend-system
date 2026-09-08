<?php

namespace Database\Seeders;

use App\Domain\MerchantManagement\Models\Merchant;
use App\Domain\MerchantManagement\Models\ProductOffer;
use App\Domain\ProductManagement\Models\Product;
use Illuminate\Database\Seeder;

class ProductOfferSeeder extends Seeder
{
    public function run(): void
    {
        $merchants = Merchant::query()->where('status', 'active')->get()->keyBy('platform');

        Product::query()->each(function (Product $product) use ($merchants): void {
            foreach ($merchants as $platform => $merchant) {
                $externalProductId = sprintf('%s-%s', $platform, $product->code);
                $referencePrice = 1000000 + ($product->id * 250000);

                ProductOffer::updateOrCreate(
                    ['platform' => $platform, 'external_product_id' => $externalProductId],
                    [
                        'product_id' => $product->id,
                        'merchant_id' => $merchant->id,
                        'product_url' => sprintf('%s/products/%s', rtrim($merchant->shop_url, '/'), $product->slug),
                        'currency' => 'VND',
                        'reference_price' => $referencePrice,
                        'original_price' => $referencePrice + 500000,
                        'rating' => 4.5,
                        'sold_count' => $product->id * 37,
                        'is_in_stock' => $product->status->value !== 'archived',
                        'status' => 'active',
                        'last_checked_at' => now(),
                    ],
                );
            }
        });
    }
}
