<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $query = Setting::query();
        if ($request->group) {
            $query->where('group', $request->group);
        }
        return $query->get();
    }

    public function updateBulk(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($request->settings as $item) {
            Setting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:settings',
            'value' => 'nullable',
            'group' => 'required|string',
            'type' => 'required|string',
            'label' => 'required|string',
        ]);

        $setting = Setting::create($validated);
        return response()->json($setting, 201);
    }
}
