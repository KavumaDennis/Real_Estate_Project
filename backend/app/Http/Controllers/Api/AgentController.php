<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount('properties')
            ->with(['properties' => function ($q) {
                $q->with('images')->where('is_published', true)->latest()->limit(3);
            }])
            ->whereHas('properties');

        if ($request->filled('location_id')) {
            $query->whereHas('properties', function ($q) use ($request) {
                $q->where('location_id', $request->location_id);
            });
        }

        $agents = $query->get()->map(function ($user) {
            return [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $user->phone,
                'avatar'         => $user->avatar_url,
                'bio'            => $user->bio,
                'specialization' => $user->specialization ?? 'Real Estate Agent',
                'listings_count' => $user->properties_count,
                'recent_listings' => $user->properties->map(function ($p) {
                    return [
                        'id'     => $p->id,
                        'title'  => $p->title,
                        'slug'   => $p->slug,
                        'price'  => $p->price,
                        'image'  => $p->images->first()?->url,
                    ];
                }),
            ];
        });

        return response()->json(['data' => $agents]);
    }

    public function show($id)
    {
        $agent = User::with([
            'properties' => function ($q) {
                $q->with(['images', 'location'])
                  ->where('is_published', true)
                  ->latest();
            },
            'reviews.user'
        ])
        ->withCount('properties')
        ->findOrFail($id);

        return response()->json([
            'id'             => $agent->id,
            'name'           => $agent->name,
            'email'          => $agent->email,
            'phone'          => $agent->phone,
            'avatar'         => $agent->avatar_url,
            'bio'            => $agent->bio ?? 'Experienced real estate professional dedicated to helping clients find their perfect property.',
            'specialization' => $agent->specialization ?? 'Residential & Commercial Properties',
            'listings_count' => $agent->properties_count,
            'properties'     => $agent->properties->map(function ($p) {
                return [
                    'id'       => $p->id,
                    'title'    => $p->title,
                    'slug'     => $p->slug,
                    'price'    => $p->price,
                    'type'     => $p->type,
                    'status'   => $p->status,
                    'address'  => $p->address,
                    'bedrooms' => $p->bedrooms,
                    'bathrooms'=> $p->bathrooms,
                    'size'     => $p->size,
                    'location' => $p->location ? $p->location->name : null,
                    'images'   => $p->images->map(fn($img) => $img->url),
                ];
            }),
            'reviews' => $agent->reviews->map(function ($r) {
                return [
                    'id' => $r->id,
                    'user' => [
                        'name' => $r->user->name,
                    ],
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'date' => $r->created_at->diffForHumans(),
                ];
            }),
        ]);
    }

    public function contact(Request $request, $id)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string',
            'message' => 'required|string',
        ]);

        return response()->json(['message' => 'Your message has been sent successfully.']);
    }
}
