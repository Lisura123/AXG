<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $minutes = 60): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Don't cache authenticated requests
        if ($request->user()) {
            return $next($request);
        }

        $key = 'route_' . md5($request->fullUrl());

        // Check if we have a cached response
        if (Cache::has($key)) {
            return response(Cache::get($key));
        }

        $response = $next($request);

        // Only cache successful responses
        if ($response->isSuccessful()) {
            Cache::put($key, $response->getContent(), now()->addMinutes($minutes));
        }

        return $response;
    }
}
