<?php

namespace Database\Seeders;

use App\Domain\MerchantManagement\Models\Merchant;
use Illuminate\Database\Seeder;

class MerchantSeeder extends Seeder
{
    public function run(): void
    {
        $merchants = [
            ['platform' => 'tiktok_shop', 'external_merchant_id' => 'tiktok-official', 'name' => 'TikTok Shop Official', 'shop_url' => 'https://shop.tiktok.com', 'status' => 'active'],
            ['platform' => 'shopee', 'external_merchant_id' => 'shopee-official', 'name' => 'Shopee Official Store', 'shop_url' => 'https://shopee.vn', 'status' => 'active'],
            ['platform' => 'lazada', 'external_merchant_id' => 'lazada-official', 'name' => 'Lazada Official Store', 'shop_url' => 'https://lazada.vn', 'status' => 'active'],
        ];

        foreach ($merchants as $merchant) {
            Merchant::updateOrCreate(
                ['platform' => $merchant['platform'], 'external_merchant_id' => $merchant['external_merchant_id']],
                $merchant,
            );
        }
    }
}
