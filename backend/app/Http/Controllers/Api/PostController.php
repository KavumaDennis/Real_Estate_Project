<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Public: published posts
    public function index()
    {
        $posts = Post::with(['category', 'author'])
            ->where('status', 'published')
            ->latest()
            ->paginate(10);

        return PostResource::collection($posts);
    }

    // Public: single post by slug
    public function show($slug)
    {
        $post = Post::with(['category', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new PostResource($post);
    }

    // Admin: all posts (any status)
    public function adminIndex()
    {
        $posts = Post::with(['category', 'author'])
            ->latest()
            ->paginate(20);

        return PostResource::collection($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'excerpt'     => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:post_categories,id',
            'status'      => 'required|in:draft,published',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $validated['slug']      = Str::slug($validated['title']) . '-' . Str::random(4);
        $validated['author_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $validated['featured_image'] = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create($validated);

        return new PostResource($post->load(['category', 'author']));
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'content'     => 'sometimes|required|string',
            'excerpt'     => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:post_categories,id',
            'status'      => 'sometimes|required|in:draft,published',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $validated['featured_image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($validated);

        return new PostResource($post->load(['category', 'author']));
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully.']);
    }
}
