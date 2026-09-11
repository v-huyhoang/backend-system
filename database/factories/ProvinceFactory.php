<?php

namespace Database\Factories;

use App\Domain\AdministrativeDivision\Models\Province;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Province> */
class ProvinceFactory extends Factory
{
    protected $model = Province::class;

    public function definition(): array
    {
        $name = fake()->unique()->city();

        return [
            'code' => (string) fake()->unique()->numberBetween(1000, 9999),
            'name' => $name,
            'slug' => str($name)->slug()->toString(),
            'type' => 'province',
            'is_active' => true,
        ];
    }
}
