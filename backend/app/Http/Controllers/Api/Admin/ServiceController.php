<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('agents:id,name,email,phone,avatar,specialization')
            ->withCount('requirements')
            ->get();
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'agent_ids'   => 'required|array',
            'agent_ids.*' => 'required|exists:users,id',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('services', 'public');
        }

        $agentIds = $validated['agent_ids'];
        unset($validated['image'], $validated['agent_ids']);

        $service = Service::create($validated);
        $service->agents()->sync($agentIds);

        return response()->json($service->load('agents'), 201);
    }

    public function show($id)
    {
        $service = Service::with('agents:id,name,email,phone,avatar,specialization')
            ->withCount('requirements')
            ->findOrFail($id);
        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'agent_ids'   => 'sometimes|required|array',
            'agent_ids.*' => 'required|exists:users,id',
        ]);

        if ($request->hasFile('image')) {
            if ($service->image_path) {
                Storage::disk('public')->delete($service->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('services', 'public');
        }

        if (isset($validated['agent_ids'])) {
            $service->agents()->sync($validated['agent_ids']);
            unset($validated['agent_ids']);
        }
        unset($validated['image']);

        $service->update($validated);

        return response()->json($service->load('agents'));
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        if ($service->image_path) {
            Storage::disk('public')->delete($service->image_path);
        }
        $service->agents()->detach();
        $service->delete();
        return response()->json(null, 204);
    }
}
