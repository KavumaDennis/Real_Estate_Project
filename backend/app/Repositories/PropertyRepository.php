<?php

namespace App\Repositories;

use App\Models\Property;
use App\Repositories\Interfaces\PropertyRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class PropertyRepository extends BaseRepository implements PropertyRepositoryInterface
{
    public function __construct(Property $property)
    {
        parent::__construct($property);
    }

    public function search(array $filters)
    {
        $query = $this->model->newQuery();

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['location_id'])) {
            $query->where('location_id', $filters['location_id']);
        }

        if (isset($filters['bedrooms'])) {
            $query->where('bedrooms', '>=', $filters['bedrooms']);
        }

        if (isset($filters['bathrooms'])) {
            $query->where('bathrooms', '>=', $filters['bathrooms']);
        }

        if (isset($filters['min_land_size'])) {
            $query->where('land_size', '>=', $filters['min_land_size']);
        }

        if (isset($filters['max_land_size'])) {
            $query->where('land_size', '<=', $filters['max_land_size']);
        }

        if (isset($filters['sort_by'])) {
            $sort = $filters['sort_by'] === 'price_low' ? 'asc' : 'desc';
            $query->orderBy('price', $sort);
        } else {
            $query->latest();
        }

        return $query->with(['location', 'images'])->paginate(12);
    }

    public function getFeatured()
    {
        return $this->model->where('is_featured', true)
            ->with(['location', 'images'])
            ->take(6)
            ->get();
    }
}
