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

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (array_key_exists('min_price', $filters) && $filters['min_price'] !== '' && $filters['min_price'] !== null) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (array_key_exists('max_price', $filters) && $filters['max_price'] !== '' && $filters['max_price'] !== null) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (array_key_exists('location_id', $filters) && $filters['location_id'] !== '' && $filters['location_id'] !== null) {
            $query->where('location_id', $filters['location_id']);
        }

        if (array_key_exists('bedrooms', $filters) && $filters['bedrooms'] !== '' && $filters['bedrooms'] !== null) {
            $query->where('bedrooms', '>=', $filters['bedrooms']);
        }

        if (array_key_exists('bathrooms', $filters) && $filters['bathrooms'] !== '' && $filters['bathrooms'] !== null) {
            $query->where('bathrooms', '>=', $filters['bathrooms']);
        }

        if (array_key_exists('min_land_size', $filters) && $filters['min_land_size'] !== '' && $filters['min_land_size'] !== null) {
            $query->where('land_size', '>=', $filters['min_land_size']);
        }

        if (array_key_exists('max_land_size', $filters) && $filters['max_land_size'] !== '' && $filters['max_land_size'] !== null) {
            $query->where('land_size', '<=', $filters['max_land_size']);
        }

        if (!empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function (Builder $q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('address', 'like', "%{$keyword}%")
                    ->orWhereHas('location', fn(Builder $loc) => $loc->where('name', 'like', "%{$keyword}%"));
            });
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
