<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all(['id', 'name', 'type', 'latitude', 'longitude']);
        return response()->json($locations);
    }

    public function top(Request $request)
    {
        $limit = max(1, min((int) $request->query('limit', 6), 20));

        $locations = Location::query()
            ->withCount('properties')
            ->having('properties_count', '>', 0)
            ->orderByDesc('properties_count')
            ->limit($limit)
            ->get(['id', 'name', 'type', 'latitude', 'longitude']);

        return response()->json($locations);
    }
}
