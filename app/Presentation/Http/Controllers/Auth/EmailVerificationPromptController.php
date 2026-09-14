<?php

namespace App\Presentation\Http\Controllers\Auth;

use App\Presentation\Http\Controllers\Controller;
use App\Presentation\Http\Support\PostAuthenticationRedirector;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    public function __construct(
        private readonly PostAuthenticationRedirector $redirector,
    ) {}

    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
            ? $this->redirector->redirect($request, $request->user())
            : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
