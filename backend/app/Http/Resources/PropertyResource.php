<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(\Illuminate\Http\Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type,
            'status' => $this->status,
            'price' => $this->price,
            'address' => $this->address,
            'location' => $this->location ? [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'type' => $this->location->type,
            ] : null,
            'agent' => $this->agent ? [
                'id' => $this->agent->id,
                'name' => $this->agent->name,
                'email' => $this->agent->email,
            ] : null,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'size' => $this->size,
            'land_details' => $this->type === 'land' ? [
                'size' => $this->land_size,
                'unit' => $this->land_size_unit,
                'zoning' => $this->zoning,
                'topography' => $this->topography,
                'access_road' => $this->access_road,
                'title_type' => $this->title_type,
                'price_per_sqm' => $this->price_per_sqm,
            ] : null,
            'coordinates' => [
                'lat' => $this->latitude,
                'lng' => $this->longitude,
            ],
            'amenities' => $this->whenLoaded('amenities', fn() => $this->amenities->map(fn($a) => ['id' => $a->id, 'name' => $a->name])),
            'images' => $this->whenLoaded('images', fn() => $this->images->map(fn($img) => $img->url)),
            'virtual_tour_url' => $this->virtual_tour_url,
            'availability' => $this->availability,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'views_count' => $this->views_count,
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at,
        ];
    }
}
