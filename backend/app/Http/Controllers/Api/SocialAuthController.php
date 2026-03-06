<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $role = Role::where('slug', 'user')->first();
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(24)),
                    'role_id' => $role->id,
                    'avatar' => $googleUser->getAvatar(),
                    'is_verified' => true, // Usually social logins are considered verified emails
                ]);
            }

            $token = $user->createToken('google_token')->plainTextToken;

            // In a real app, you might want to redirect to a frontend URL with the token
            // For API, we'll return a view or a redirect that the frontend can handle
            return redirect(env('FRONTEND_URL') . '/login/callback?token=' . $token);
            
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL') . '/login?error=google_auth_failed');
        }
    }
}
