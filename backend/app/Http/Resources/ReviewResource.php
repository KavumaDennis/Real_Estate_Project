<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property' => $this->property_id ? [
                'id' => $this->property->id,
                'title' => $this->property->title,
                'slug' => $this->property->slug,
            ] : null,
            'agent' => $this->agent_id ? [
                'id' => $this->agent->id,
                'name' => $this->agent->name,
                'avatar' => $this->agent->avatar ? url('storage/' . $this->agent->avatar) : null,
            ] : null,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar ? url('storage/' . $this->user->avatar) : null,
            ],
            'rating' => $this->rating,
            'comment' => $this->comment,
            'is_approved' => $this->is_approved,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
