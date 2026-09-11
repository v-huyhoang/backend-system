<?php

namespace App\Providers;

use App\Application\AdministrativeDivision\Contracts\AdministrativeDivisionSource;
use App\Domain\AdministrativeDivision\Contracts\AdministrativeDivisionRepository;
use App\Infrastructure\AdministrativeDivision\ProvinceOpenApiClient;
use App\Infrastructure\Persistence\AdministrativeDivision\EloquentAdministrativeDivisionRepository;
use Illuminate\Support\ServiceProvider;

class AdministrativeDivisionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AdministrativeDivisionSource::class,
            ProvinceOpenApiClient::class,
        );
        $this->app->bind(
            AdministrativeDivisionRepository::class,
            EloquentAdministrativeDivisionRepository::class,
        );
    }
}
