<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('role');

        if ($request->role) {
            $query->whereHas('role', fn($q) => $q->where('slug', $request->role));
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        return $query->latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user->load('role'), 201);
    }

    public function show($id)
    {
        return User::with(['role', 'properties'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        if ($request->password) {
            $request->validate(['password' => Password::defaults()]);
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return response()->json($user->load('role'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function roles()
    {
        return Role::all();
    }

    public function toggleVerification($id)
    {
        $user = User::findOrFail($id);
        $user->is_verified = !$user->is_verified;
        $user->verified_at = $user->is_verified ? now() : null;
        $user->save();

        return response()->json([
            'message' => $user->is_verified ? 'Agent verified successfully' : 'Agent verification revoked',
            'is_verified' => $user->is_verified
        ]);
    }
}
