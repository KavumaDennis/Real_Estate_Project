<?php

namespace App\Services;

use App\Models\Amenity;
use App\Repositories\Interfaces\PropertyRepositoryInterface;
use Illuminate\Support\Str;

class PropertyService
{
    protected $propertyRepository;

    public function __construct(PropertyRepositoryInterface $propertyRepository)
    {
        $this->propertyRepository = $propertyRepository;
    }

    public function getAllProperties(array $filters = [])
    {
        if (empty($filters)) {
            return $this->propertyRepository->all();
        }
        return $this->propertyRepository->search($filters);
    }

    public function getFeaturedProperties()
    {
        return $this->propertyRepository->getFeatured();
    }

    public function getPropertyBySlug($slug)
    {
        return \App\Models\Property::where('slug', $slug)
            ->with(['location', 'agent', 'amenities', 'images', 'documents'])
            ->firstOrFail();
    }

    public function createProperty(array $data)
    {
        if (!isset($data['slug']) && isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        }
        
        // Assign current user as agent if not provided
        if (!isset($data['agent_id']) && auth()->check()) {
            $data['agent_id'] = auth()->id();
        }

        $images = $data['images'] ?? [];
        $amenityNames = $data['amenity_names'] ?? [];
        unset($data['images'], $data['amenity_names']);

        $property = $this->propertyRepository->create($data);

        $this->syncAmenitiesFromNames($property, $amenityNames);

        if (!empty($images)) {
            foreach ($images as $image) {
                $path = $image->store('properties', 'public');
                $property->images()->create([
                    'image_path' => $path,
                    'is_main' => false // You could set the first one as main
                ]);
            }
        }

        return $property;
    }

    public function updateProperty(\App\Models\Property $property, array $data)
    {
        $images = $data['images'] ?? [];
        $amenityNames = $data['amenity_names'] ?? null;
        unset($data['images'], $data['amenity_names']);

        $property->update($data);

        if ($amenityNames !== null) {
            $this->syncAmenitiesFromNames($property, $amenityNames);
        }

        if (!empty($images)) {
            // Replace existing images when new ones are uploaded from edit flow.
            foreach ($property->images as $existingImage) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($existingImage->image_path);
                $existingImage->delete();
            }

            foreach ($images as $image) {
                $path = $image->store('properties', 'public');
                $property->images()->create(['image_path' => $path, 'is_main' => false]);
            }
        }

        return $property->fresh();
    }

    public function deleteProperty(\App\Models\Property $property)
    {
        foreach ($property->images as $image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }
        $property->delete();
    }

    protected function syncAmenitiesFromNames(\App\Models\Property $property, array $names): void
    {
        $ids = [];
        foreach (array_filter(array_map('trim', $names)) as $name) {
            if ($name === '') continue;
            $amenity = Amenity::firstOrCreate(['name' => $name], ['icon' => '']);
            $ids[] = $amenity->id;
        }
        $property->amenities()->sync($ids);
    }
}
