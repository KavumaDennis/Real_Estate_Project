<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageUrlHelper
{
    /**
     * Get the full URL for a storage path. Uses the current request's host
     * when available (so API URLs match the client's origin), otherwise falls
     * back to APP_URL. This fixes image loading when APP_URL lacks the port.
     */
    public static function url(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $path = ltrim($path, '/');
        $base = config('app.url');

        try {
            if (app()->has('request') && $request = request()) {
                $host = $request->getHost();
                if ($host) {
                    $base = $request->getSchemeAndHttpHost();
                }
            }
        } catch (\Throwable $e) {
            // Fall back to config
        }

        return rtrim($base, '/') . '/storage/' . $path;
    }
}
