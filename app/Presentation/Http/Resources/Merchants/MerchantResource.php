<?php

namespace App\Presentation\Http\Resources\Merchants;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantResource extends JsonResource
{
	/** @return array<string, mixed> */
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'platform' => $this->platform,
			'external_merchant_id' => $this->external_merchant_id,
			'name' => $this->name,
			'shop_url' => $this->shop_url,
			'status' => $this->status,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
			// Add fields exposed to the presentation layer here.
		];
	}
}
