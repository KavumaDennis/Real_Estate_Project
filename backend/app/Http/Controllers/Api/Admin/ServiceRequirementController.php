<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequirement;
use Illuminate\Http\Request;

class ServiceRequirementController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequirement::with([
            'service:id,name,image_path',
            'user:id,name,email,phone'
        ])->latest();

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    public function update(Request $request, $id)
    {
        $requirement = ServiceRequirement::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $requirement->update($validated);

        return response()->json([
            'message' => 'Service requirement status updated.',
            'data' => $requirement->fresh()->load(['service:id,name', 'user:id,name,email']),
        ]);
    }
}
