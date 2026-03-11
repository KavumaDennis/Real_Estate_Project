<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $property = $this->property;
        $agent = $this->agent;

        return [
            'id' => $this->id,
            'property' => $property ? [
                'id' => $property->id,
                'title' => $property->title,
                'slug' => $property->slug,
                'images' => $property->images->map(fn($img) => \App\Helpers\StorageUrlHelper::url($img->image_path)),
            ] : null,
            'agent' => $agent ? [
                'id' => $agent->id,
                'name' => $agent->name,
                'email' => $agent->email,
            ] : null,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ] : null,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
