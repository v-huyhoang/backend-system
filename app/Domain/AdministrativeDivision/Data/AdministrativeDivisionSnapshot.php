<?php

namespace App\Domain\AdministrativeDivision\Data;

use InvalidArgumentException;

final readonly class AdministrativeDivisionSnapshot
{
    /**
     * @param  list<array{code: string, name: string, slug: string, type: string, meta: array<string, mixed>}>  $provinces
     * @param  list<array{province_code: string, code: string, name: string, slug: string, type: string, meta: array<string, mixed>}>  $wards
     */
    public function __construct(
        public array $provinces,
        public array $wards,
    ) {
        if ($provinces === []) {
            throw new InvalidArgumentException('Administrative division source returned no provinces.');
        }
    }
}
