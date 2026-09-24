<?php

namespace App\Presentation\Http\Support;

use App\Domain\AccessControl\Enums\SystemPermission;
use App\Domain\UserManagement\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class PostAuthenticationRedirector
{
    public function redirect(Request $request, User $user, string $suffix = ''): RedirectResponse
    {
        if ($this->isAdminIntendedUrl($request->session()->get('url.intended'))) {
            $request->session()->forget('url.intended');
        }

        return redirect()->intended($this->fallbackUrl($user).$suffix);
    }

    private function fallbackUrl(User $user): string
    {
        return $user->can(SystemPermission::ViewListingModeration->value)
            ? route('admin.dashboard', absolute: false)
            : route('home', absolute: false);
    }

    private function isAdminIntendedUrl(mixed $intendedUrl): bool
    {
        if (! is_string($intendedUrl)) {
            return false;
        }

        $path = parse_url($intendedUrl, PHP_URL_PATH);

        return is_string($path) && ($path === '/admin' || str_starts_with($path, '/admin/'));
    }
}
