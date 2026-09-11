<?php

namespace Database\Factories;

use App\Domain\Rental\Models\Amenity;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Amenity> */
class AmenityFactory extends Factory
{
    protected $model = Amenity::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => str($name)->slug()->toString(),
            'icon' => null,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
