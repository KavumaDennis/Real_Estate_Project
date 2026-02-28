<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends Controller
{
    public function index()
    {
        return response()->json(Amenity::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:amenities,name',
            'icon' => 'nullable|string',
        ]);

        $amenity = Amenity::create($validated);
        return response()->json($amenity, 201);
    }

    public function update(Request $request, $id)
    {
        $amenity = Amenity::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|unique:amenities,name,' . $id,
            'icon' => 'nullable|string',
        ]);

        $amenity->update($validated);
        return response()->json($amenity);
    }

    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);
        $amenity->delete();
        return response()->json(null, 204);
    }
}
