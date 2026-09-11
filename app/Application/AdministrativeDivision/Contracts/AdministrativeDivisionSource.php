<?php

namespace App\Application\AdministrativeDivision\Contracts;

use App\Domain\AdministrativeDivision\Data\AdministrativeDivisionSnapshot;

interface AdministrativeDivisionSource
{
    public function fetch(): AdministrativeDivisionSnapshot;
}
