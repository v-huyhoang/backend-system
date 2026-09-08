<?php

namespace App\Presentation\Http\Controllers;

use App\Application\MerchantManagement\DTOs\StoreMerchantData;
use App\Application\MerchantManagement\DTOs\UpdateMerchantData;
use App\Application\MerchantManagement\MerchantService;
use App\Domain\MerchantManagement\Models\Merchant;
use App\Presentation\Http\Requests\Merchants\IndexMerchantRequest;
use App\Presentation\Http\Requests\Merchants\StoreMerchantRequest;
use App\Presentation\Http\Requests\Merchants\UpdateMerchantRequest;
use App\Presentation\Http\Resources\Merchants\MerchantCollection;
use App\Presentation\Http\Resources\Merchants\MerchantResource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MerchantController extends Controller
{
	private const PREFIX_ADMIN_MERCHANT = 'admin/merchants/';
	public function __construct(private readonly MerchantService $merchants)
	{
	}

	public function index(IndexMerchantRequest $request): Response
	{
		$filters = $request->validated();

		return Inertia::render(self::PREFIX_ADMIN_MERCHANT . 'index', [
			'merchants' => new MerchantCollection($this->merchants->paginate($filters)),
		]);
	}

	public function create(): Response
	{
		return Inertia::render('merchants/create');
	}

	public function store(StoreMerchantRequest $request): RedirectResponse
	{
		$this->merchants->create(StoreMerchantData::fromArray($request->validated()));

		return to_route('merchants.index')->with('message', 'Merchant created successfully.');
	}

	public function edit(Merchant $merchant): Response
	{
		return Inertia::render('merchants/edit', [
			'merchant' => new MerchantResource($merchant),
		]);
	}

	public function update(UpdateMerchantRequest $request, Merchant $merchant): RedirectResponse
	{
		$this->merchants->update($merchant, UpdateMerchantData::fromArray($request->validated()));

		return to_route('merchants.index')->with('message', 'Merchant updated successfully.');
	}

	public function destroy(Merchant $merchant): RedirectResponse
	{
		$this->merchants->delete($merchant);

		return to_route('merchants.index')->with('message', 'Merchant deleted successfully.');
	}
}
