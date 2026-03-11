<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    private function authorizeAdmin(Request $request): void
    {
        $slug = $request->user()?->role?->slug;
        abort_unless(in_array($slug, ['admin', 'super-admin'], true), 403, 'Unauthorized');
    }

    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $query = ContactMessage::query()->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_read')) {
            $isRead = filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($isRead !== null) {
                $query->where('is_read', $isRead);
            }
        }

        return response()->json($query->paginate(20));
    }

    public function show(Request $request, int $id)
    {
        $this->authorizeAdmin($request);

        $message = ContactMessage::findOrFail($id);
        if (!$message->is_read) {
            $message->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return response()->json($message);
    }

    public function markRead(Request $request, int $id)
    {
        $this->authorizeAdmin($request);

        $message = ContactMessage::findOrFail($id);
        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Contact message marked as read.',
            'data' => $message,
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $this->authorizeAdmin($request);

        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Contact message deleted successfully.']);
    }
}

