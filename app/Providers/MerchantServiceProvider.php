<?php

namespace App\Providers;

use App\Domain\MerchantManagement\Contracts\MerchantRepository;
use App\Domain\MerchantManagement\Models\Merchant;
use App\Infrastructure\Persistence\MerchantManagement\EloquentMerchantRepository;
use App\Policies\MerchantPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class MerchantServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MerchantRepository::class, EloquentMerchantRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(Merchant::class, MerchantPolicy::class);
    }
}
