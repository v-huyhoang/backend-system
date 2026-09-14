<?php

namespace App\Presentation\Http\Responses;

use App\Presentation\Http\Support\PostAuthenticationRedirector;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

final class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function __construct(
        private readonly PostAuthenticationRedirector $redirector,
    ) {}

    public function toResponse($request): JsonResponse|\Illuminate\Http\RedirectResponse
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        return $this->redirector->redirect($request, $request->user());
    }
}
