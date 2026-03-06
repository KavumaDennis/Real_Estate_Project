<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedPost;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;

class SavedPostController extends Controller
{
    public function index(Request $request)
    {
        $saved = SavedPost::with('post.category', 'post.author')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->pluck('post');

        return PostResource::collection($saved);
    }

    public function toggle(Request $request, $postId)
    {
        $user = $request->user();
        $saved = SavedPost::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        if ($saved) {
            $saved->delete();
            return response()->json(['saved' => false, 'message' => 'Article removed from saved.']);
        }

        SavedPost::create([
            'user_id' => $user->id,
            'post_id' => $postId
        ]);

        return response()->json(['saved' => true, 'message' => 'Article saved successfully.']);
    }
}
