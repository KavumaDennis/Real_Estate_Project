<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Http\Resources\InquiryResource;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Inquiry::with(['property.images', 'user', 'agent']);

        // Agents see inquiries for their properties AND direct contacts to them
        if ($user->role?->slug === 'agent') {
            $query->where(function ($q) use ($user) {
                $q->whereHas('property', function ($inner) use ($user) {
                    $inner->where('agent_id', $user->id);
                })->orWhere('agent_id', $user->id);
            });
        } elseif ($user->role?->slug !== 'admin') {
            // Regular users see their own inquiries
            $query->where('user_id', $user->id);
        }

        $inquiries = $query->latest()->paginate(15);

        return InquiryResource::collection($inquiries);
    }

    public function update(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        
        // Authorization
        $user = $request->user();
        $isOwner = false;
        if ($inquiry->property_id && $inquiry->property->agent_id === $user->id) {
            $isOwner = true;
        } elseif ($inquiry->agent_id === $user->id) {
            $isOwner = true;
        }

        if ($user->role?->slug === 'agent' && !$isOwner) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,closed'
        ]);

        $inquiry->update($validated);

        return new InquiryResource($inquiry->load(['property.images', 'user', 'agent']));
    }

    public function destroy(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        
        // Authorization
        $user = $request->user();
        $isOwner = false;
        if ($inquiry->property_id && $inquiry->property->agent_id === $user->id) {
            $isOwner = true;
        } elseif ($inquiry->agent_id === $user->id) {
            $isOwner = true;
        }

        if ($user->role?->slug !== 'admin' && ($user->role?->slug === 'agent' && !$isOwner)) {
            abort(403);
        }

        $inquiry->delete();

        return response()->json(['message' => 'Inquiry deleted successfully']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'agent_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        if (!$request->property_id && !$request->agent_id) {
            return response()->json(['message' => 'Either property_id or agent_id is required.'], 422);
        }

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';

        $inquiry = Inquiry::create($validated);

        return new InquiryResource($inquiry->load(['property.images', 'user', 'agent']));
    }
}
