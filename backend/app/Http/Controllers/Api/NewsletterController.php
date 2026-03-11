<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name'  => 'nullable|string|max:255',
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $validated['email']],
            ['name' => $validated['name'] ?? null]
        );

        $isNew = $subscriber->wasRecentlyCreated;

        return response()->json([
            'message' => $isNew ? 'Thank you for subscribing to our newsletter!' : "You're already subscribed to our newsletter.",
            'subscriber' => $subscriber,
        ], $isNew ? 201 : 200);
    }
}
