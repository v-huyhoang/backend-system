<?php

namespace Database\Factories;

use App\Domain\AdministrativeDivision\Models\Ward;
use App\Domain\Rental\Enums\ListingStatus;
use App\Domain\Rental\Models\Listing;
use App\Domain\Rental\Models\PropertyType;
use App\Domain\UserManagement\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Listing> */
class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'public_id' => (string) Str::ulid(),
            'landlord_id' => User::factory(),
            'property_type_id' => PropertyType::factory(),
            'ward_id' => Ward::factory(),
            'title' => $title,
            'slug' => str($title)->slug()->append('-'.fake()->unique()->numberBetween(1, 999999))->toString(),
            'description' => fake()->paragraph(),
            'address_detail' => fake()->streetAddress(),
            'monthly_rent' => fake()->numberBetween(2_000_000, 10_000_000),
            'deposit_amount' => fake()->numberBetween(1_000_000, 5_000_000),
            'area_sqm' => fake()->randomFloat(2, 15, 60),
            'max_occupants' => fake()->numberBetween(1, 4),
            'available_from' => now()->toDateString(),
            'contact_name' => fake()->name(),
            'contact_phone' => fake()->numerify('0#########'),
            'status' => ListingStatus::Draft,
            'view_count' => 0,
            'contact_count' => 0,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => ListingStatus::Published,
            'published_at' => now()->subHour(),
            'expires_at' => now()->addMonth(),
        ]);
    }

    public function expired(): static
    {
        return $this->published()->state(fn () => [
            'expires_at' => now()->subMinute(),
        ]);
    }
}
