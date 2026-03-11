<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'type', 'status', 'price', 'address',
        'location_id', 'agent_id', 'bedrooms', 'bathrooms', 'size',
        'land_size', 'land_size_unit', 'zoning', 'topography', 'access_road',
        'title_type', 'price_per_sqm', 'latitude', 'longitude',
        'virtual_tour_url', 'availability', 'is_featured', 'is_published', 'views_count'
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenity');
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function documents()
    {
        return $this->hasMany(PropertyDocument::class);
    }

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function managementRequests()
    {
        return $this->hasMany(PropertyManagementRequest::class);
    }
}
