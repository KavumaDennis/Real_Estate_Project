<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedProperty;
use App\Http\Resources\PropertyResource;
use Illuminate\Http\Request;

class SavedPropertyController extends Controller
{
    public function index(Request $request)
    {
        $saved = SavedProperty::with('property.category', 'property.location', 'property.agent', 'property.images')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->pluck('property');

        return PropertyResource::collection($saved);
    }

    public function toggle(Request $request, $propertyId)
    {
        $user = $request->user();
        $saved = SavedProperty::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($saved) {
            $saved->delete();
            return response()->json(['saved' => false, 'message' => 'Property removed from saved listings.']);
        }

        SavedProperty::create([
            'user_id' => $user->id,
            'property_id' => $propertyId
        ]);

        return response()->json(['saved' => true, 'message' => 'Property saved successfully.']);
    }
}
