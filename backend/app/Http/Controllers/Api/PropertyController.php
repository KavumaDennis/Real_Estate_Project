<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use App\Http\Resources\PropertyResource;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    protected $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    public function index(Request $request)
    {
        $properties = $this->propertyService->getAllProperties($request->all());
        return PropertyResource::collection($properties);
    }

    public function show($slug)
    {
        $property = $this->propertyService->getPropertyBySlug($slug);
        
        // Record view with timestamp for analytics
        \App\Models\PropertyView::create([
            'property_id' => $property->id,
            'user_id' => auth()->id(),
            'ip_address' => request()->ip()
        ]);

        $property->increment('views_count');
        return new PropertyResource($property->load(['location', 'agent', 'images', 'amenities', 'reviews.user']));
    }

    public function featured()
    {
        $properties = $this->propertyService->getFeaturedProperties();
        return PropertyResource::collection($properties);
    }

    public function myProperties()
    {
        $properties = \App\Models\Property::where('agent_id', auth()->id())
            ->with(['location', 'images'])
            ->latest()
            ->get();
        return PropertyResource::collection($properties);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'type'           => 'required|in:house,apartment,commercial,land',
            'status'         => 'required|in:for_sale,for_rent',
            'price'          => 'required|numeric',
            'address'        => 'required|string',
            'location_id'    => 'required|exists:locations,id',
            'bedrooms'       => 'nullable|integer',
            'bathrooms'      => 'nullable|integer',
            'size'           => 'nullable|numeric',
            'land_size'      => 'nullable|numeric',
            'land_size_unit' => 'nullable|string',
            'zoning'         => 'nullable|string',
            'topography'     => 'nullable|string',
            'access_road'    => 'nullable|string',
            'title_type'     => 'nullable|string',
            'price_per_sqm'  => 'nullable|numeric',
            'virtual_tour_url' => 'nullable|url|max:255',
            'availability'   => 'nullable|in:available,sold,reserved,off_market',
            'images'         => 'nullable|array',
            'images.*'       => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $user = auth()->user();
        if ($user->role?->slug === 'agent' && !$user->is_verified) {
            return response()->json(['message' => 'Your account must be verified by an admin before you can list properties.'], 403);
        }

        $property = $this->propertyService->createProperty($validated);
        return new PropertyResource($property->load(['location', 'agent', 'images']));
    }

    public function update(Request $request, $id)
    {
        $property = \App\Models\Property::findOrFail($id);

        // Ensure only the owner or admin can update
        if ($property->agent_id !== auth()->id() && auth()->user()->role?->slug !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title'          => 'sometimes|required|string|max:255',
            'description'    => 'sometimes|required|string',
            'type'           => 'sometimes|required|in:house,apartment,commercial,land',
            'status'         => 'sometimes|required|in:for_sale,for_rent',
            'price'          => 'sometimes|required|numeric',
            'address'        => 'sometimes|required|string',
            'location_id'    => 'sometimes|required|exists:locations,id',
            'bedrooms'       => 'nullable|integer',
            'bathrooms'      => 'nullable|integer',
            'size'           => 'nullable|numeric',
            'virtual_tour_url' => 'nullable|url|max:255',
            'availability'   => 'nullable|in:available,sold,reserved,off_market',
            'images'         => 'nullable|array',
            'images.*'       => 'image|mimes:jpeg,png,jpg|max:5120',
            'is_published'   => 'nullable|boolean',
            'is_featured'    => 'nullable|boolean',
        ]);

        $property = $this->propertyService->updateProperty($property, $validated);
        return new PropertyResource($property->load(['location', 'agent', 'images']));
    }

    public function destroy($id)
    {
        $property = \App\Models\Property::findOrFail($id);

        if ($property->agent_id !== auth()->id() && auth()->user()->role?->slug !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $this->propertyService->deleteProperty($property);
        return response()->json(['message' => 'Property deleted successfully.']);
    }

    public function toggleFeatured($id)
    {
        if (auth()->user()->role?->slug !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $property = \App\Models\Property::findOrFail($id);
        $property->is_featured = !$property->is_featured;
        $property->save();

        return response()->json([
            'message' => $property->is_featured ? 'Property marked as featured' : 'Property removed from featured',
            'is_featured' => $property->is_featured
        ]);
    }
}
