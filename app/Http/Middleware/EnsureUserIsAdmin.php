<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        // Vérifier si l'utilisateur a le rôle admin ou super-admin
        if (! $request->user()->hasAnyRole(['admin', 'super-admin'])) {
            abort(403, 'Accès refusé. Vous devez être administrateur ou super-administrateur.');
        }

        return $next($request);
    }
}
