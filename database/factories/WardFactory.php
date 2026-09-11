<?php

namespace Database\Factories;

use App\Domain\AdministrativeDivision\Models\Province;
use App\Domain\AdministrativeDivision\Models\Ward;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Ward> */
class WardFactory extends Factory
{
    protected $model = Ward::class;

    public function definition(): array
    {
        $name = fake()->unique()->streetName();

        return [
            'province_id' => Province::factory(),
            'code' => (string) fake()->unique()->numberBetween(10000, 99999),
            'name' => $name,
            'slug' => str($name)->slug()->toString(),
            'type' => 'ward',
            'is_active' => true,
        ];
    }
}
