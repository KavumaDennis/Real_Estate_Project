<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\StyledNotificationMail;
use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PostController extends Controller
{
    private function isAdminUser(): bool
    {
        $slug = auth()->user()?->role?->slug;
        return in_array($slug, ['admin', 'super-admin'], true);
    }

    private function authorizePostAccess(Post $post): void
    {
        if ($this->isAdminUser()) {
            return;
        }

        abort_unless((int) $post->author_id === (int) auth()->id(), 403, 'Unauthorized action.');
    }

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

    // Authenticated user: own posts (any status)
    public function myIndex()
    {
        $posts = Post::with(['category', 'author'])
            ->where('author_id', auth()->id())
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
        $post->load(['author']);
        $this->sendPostCreatedEmails($post);

        return new PostResource($post->load(['category', 'author']));
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $oldStatus = $post->status;
        $oldAuthorId = $post->author_id;
        $this->authorizePostAccess($post);

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
        $post->refresh()->load(['author']);
        $this->sendPostUpdatedEmails($post, $oldStatus, (int) $oldAuthorId);

        return new PostResource($post->load(['category', 'author']));
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $title = $post->title;
        $author = $post->author()->first();
        $authorId = $post->author_id;
        $this->authorizePostAccess($post);
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }
        $post->delete();
        $this->sendPostDeletedEmails($title, $author, (int) $authorId);
        return response()->json(['message' => 'Post deleted successfully.']);
    }

    private function sendPostCreatedEmails(Post $post): void
    {
        $actor = auth()->user();
        $baseUrl = rtrim(env('FRONTEND_URL', env('APP_URL', 'http://localhost:5173')), '/');
        $url = $baseUrl . '/blog/' . $post->slug;

        if (!empty($post->author?->email)) {
            $this->sendEmailSafe(
                $post->author->email,
                'Blog Post Saved',
                'Blog Post Saved',
                "Your post \"{$post->title}\" was saved successfully.",
                [
                    "Current status: {$post->status}",
                    $post->status === 'published' ? "Published URL: {$url}" : null,
                ],
                $post->status === 'published' ? 'View Post' : 'Open Dashboard',
                $post->status === 'published'
                    ? $url
                    : rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/dashboard/blog'
            );
        }

        if (!$this->isAdminUser()) {
            $adminEmails = User::whereHas('role', fn($q) => $q->whereIn('slug', ['admin', 'super-admin']))
                ->whereNotNull('email')
                ->pluck('email')
                ->unique()
                ->values()
                ->all();

            foreach ($adminEmails as $email) {
                $this->sendEmailSafe(
                    $email,
                    'New Blog Post Activity',
                    'Blog Activity Alert',
                    "{$actor?->name} created a blog post.",
                    [
                        "Title: {$post->title}",
                        "Status: {$post->status}",
                    ],
                    'Open Admin Blog',
                    rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/admin/blog'
                );
            }
        }
    }

    private function sendPostUpdatedEmails(Post $post, string $oldStatus, int $oldAuthorId): void
    {
        $actor = auth()->user();
        $baseUrl = rtrim(env('FRONTEND_URL', env('APP_URL', 'http://localhost:5173')), '/');
        $url = $baseUrl . '/blog/' . $post->slug;
        $statusChangedToPublished = $oldStatus !== 'published' && $post->status === 'published';
        $adminEditedOthersPost = $this->isAdminUser() && (int) $oldAuthorId !== (int) $actor?->id;

        if (($statusChangedToPublished || $adminEditedOthersPost) && !empty($post->author?->email)) {
            $lines = [
                "Your post \"{$post->title}\" has been updated.",
                "Current status: {$post->status}",
                $statusChangedToPublished ? "Published URL: {$url}" : null,
            ];

            if ($adminEditedOthersPost) {
                $lines[] = "Updated by admin: {$actor?->name}";
            }

            $this->sendEmailSafe(
                $post->author->email,
                'Blog Post Updated',
                'Blog Post Updated',
                "Your post \"{$post->title}\" has been updated.",
                $lines,
                $post->status === 'published' ? 'View Post' : 'Open Dashboard',
                $post->status === 'published'
                    ? $url
                    : rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/dashboard/blog'
            );
        }
    }

    private function sendPostDeletedEmails(string $title, ?User $author, int $authorId): void
    {
        $actor = auth()->user();
        $adminDeletedOthersPost = $this->isAdminUser() && $authorId !== (int) $actor?->id;

        if ($adminDeletedOthersPost && !empty($author?->email)) {
            $this->sendEmailSafe(
                $author->email,
                'Blog Post Deleted',
                'Blog Post Deleted',
                'An admin removed one of your posts.',
                [
                    "Deleted post: {$title}",
                    "Updated by admin: {$actor?->name}",
                ],
                'Open Dashboard',
                rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/dashboard/blog'
            );
        }
    }

    private function sendEmailSafe(?string $to, string $subject, string $title, ?string $intro, array $lines, ?string $ctaText = null, ?string $ctaUrl = null): void
    {
        if (empty($to)) {
            return;
        }

        try {
            Mail::to($to)->send(new StyledNotificationMail($subject, $title, $intro, $lines, $ctaText, $ctaUrl));
        } catch (\Throwable $e) {
            Log::warning('Failed to send blog email', [
                'to' => $to,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
