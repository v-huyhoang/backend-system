<?php

namespace Tests\Unit;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\AccessControl\Enums\SystemRole;
use App\Domain\Sales\Enums\MembershipRank;
use App\Domain\Shared\Enums\ActiveStatus;
use PHPUnit\Framework\TestCase;

class DomainEnumTest extends TestCase
{
    public function test_active_status_exposes_boolean_semantics(): void
    {
        $this->assertTrue(ActiveStatus::Active->isActive());
        $this->assertFalse(ActiveStatus::Inactive->isActive());
        $this->assertSame(1, ActiveStatus::Active->value);
    }

    public function test_system_access_control_values_are_stable(): void
    {
        $this->assertSame('admin', SystemRole::Admin->value);
        $this->assertContains('view_roles', SystemPermission::values());
        $this->assertContains('delete_users', SystemPermission::values());
        $this->assertCount(17, SystemPermission::cases());
    }

    public function test_membership_rank_values_match_database_values(): void
    {
        $this->assertSame('Standard', MembershipRank::Standard->value);
        $this->assertSame('Platinum', MembershipRank::Platinum->value);
    }
}
