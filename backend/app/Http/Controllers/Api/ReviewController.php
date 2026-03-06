<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Review::with(['property', 'user', 'agent']);

        if ($user->role?->slug === 'agent') {
            $query->where(function ($q) use ($user) {
                $q->whereHas('property', function ($inner) use ($user) {
                    $inner->where('agent_id', $user->id);
                })->orWhere('agent_id', $user->id);
            });
        } elseif ($user->role?->slug !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $reviews = $query->latest()->paginate(15);
        return ReviewResource::collection($reviews);
    }

    public function toggleApproval(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        
        // Only admin or the agent who owns the property/profile can approve/hide reviews
        $user = $request->user();
        $isOwner = false;
        if ($review->property_id && $review->property->agent_id === $user->id) {
            $isOwner = true;
        } elseif ($review->agent_id === $user->id) {
            $isOwner = true;
        }

        if ($user->role?->slug !== 'admin' && !$isOwner) {
            abort(403);
        }

        $review->update(['is_approved' => !$review->is_approved]);

        return new ReviewResource($review->load(['property', 'user', 'agent']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'agent_id'    => 'nullable|exists:users,id',
            'rating'      => 'required|integer|min:1|max:5',
            'comment'     => 'required|string|max:1000',
        ]);

        if (!$request->property_id && !$request->agent_id) {
            return response()->json(['message' => 'Either property_id or agent_id is required.'], 422);
        }

        if ($request->property_id && $request->agent_id) {
            return response()->json(['message' => 'A review can only be for a property or an agent, not both.'], 422);
        }

        $validated['user_id'] = auth()->id();
        $validated['is_approved'] = true; // Auto-approve for now, or match existing logic

        $review = Review::create($validated);

        return new ReviewResource($review->load(['property', 'user', 'agent']));
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        
        $user = $request->user();
        if ($user->role?->slug !== 'admin' && $review->user_id !== $user->id) {
            abort(403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
