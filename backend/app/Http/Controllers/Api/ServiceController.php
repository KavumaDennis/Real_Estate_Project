<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('agents:id,name,email,phone,avatar,specialization')
            ->withCount('requirements')
            ->latest()
            ->get();

        return response()->json($services);
    }

    public function show($id)
    {
        $service = Service::with('agents:id,name,email,phone,avatar,specialization')
            ->withCount('requirements')
            ->findOrFail($id);

        return response()->json($service);
    }

    public function require(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'phone' => 'nullable|string|max:30',
            'notes' => 'nullable|string|max:2000',
        ]);

        $requirement = $service->requirements()->create([
            'user_id' => $request->user()->id,
            'phone' => $validated['phone'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Service request submitted successfully.',
            'data' => $requirement->load('user:id,name,email'),
        ], 201);
    }
}
