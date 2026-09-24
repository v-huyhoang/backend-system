<?php

namespace App\Console\Commands;

use App\Application\Rental\ListingExpirationService;
use Illuminate\Console\Command;

class ExpireListings extends Command
{
    protected $signature = 'listings:expire';
    protected $description = 'Expire published listings whose visibility period has ended.';

    public function handle(ListingExpirationService $expiration): int
    {
        $this->info(sprintf('Expired %d listing(s).', $expiration->expireDueListings()));

        return self::SUCCESS;
    }
}
