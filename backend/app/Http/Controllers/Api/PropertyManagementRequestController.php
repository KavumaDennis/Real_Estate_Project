<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\StyledNotificationMail;
use App\Models\Property;
use App\Models\PropertyManagementRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PropertyManagementRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = PropertyManagementRequest::with([
            'property:id,title,slug,address,price,agent_id',
            'user:id,name,email,phone',
            'reviewer:id,name',
        ]);
        $query->where('user_id', $user->id);

        return response()->json($query->latest()->paginate(20));
    }

    public function adminIndex(Request $request)
    {
        $user = $request->user();
        $slug = $user->role?->slug;
        if (!in_array($slug, ['admin', 'super-admin'])) {
            abort(403, 'Unauthorized');
        }

        $query = PropertyManagementRequest::with([
            'property:id,title,slug,address,price,agent_id',
            'user:id,name,email,phone',
            'reviewer:id,name',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('owner_name', 'like', "%{$search}%")
                    ->orWhere('owner_email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'title' => 'nullable|string|max:255',
            'property_type' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'management_scope' => 'required|string|max:100',
            'notes' => 'nullable|string|max:5000',
            'owner_name' => 'nullable|string|max:255',
            'owner_email' => 'nullable|email|max:255',
            'owner_phone' => 'nullable|string|max:50',
        ]);

        $property = null;
        if (!empty($validated['property_id'])) {
            $property = Property::findOrFail($validated['property_id']);
            if ($property->agent_id !== $user->id) {
                abort(403, 'You can only request management for your own properties.');
            }
        }

        $requestData = [
            'user_id' => $user->id,
            'property_id' => $property?->id,
            'title' => $validated['title'] ?? $property?->title ?? 'Untitled Property',
            'property_type' => $validated['property_type'] ?? $property?->type,
            'address' => $validated['address'] ?? $property?->address ?? '',
            'management_scope' => $validated['management_scope'],
            'notes' => $validated['notes'] ?? null,
            'owner_name' => $validated['owner_name'] ?? $user->name,
            'owner_email' => $validated['owner_email'] ?? $user->email,
            'owner_phone' => $validated['owner_phone'] ?? $user->phone,
            'status' => 'pending',
        ];

        $pmr = PropertyManagementRequest::create($requestData);
        $pmr->load(['user:id,name,email']);
        $this->sendManagementRequestCreatedEmails($pmr);

        return response()->json($pmr->load(['property:id,title,slug,address,price', 'user:id,name,email,phone']), 201);
    }

    public function cancel(Request $request, $id)
    {
        $pmr = PropertyManagementRequest::findOrFail($id);
        $user = $request->user();

        if ($pmr->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if (!in_array($pmr->status, ['pending', 'under_review'])) {
            return response()->json(['message' => 'Only pending or under review requests can be cancelled.'], 422);
        }

        $pmr->update([
            'status' => 'cancelled',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        return response()->json(['message' => 'Management request cancelled.', 'data' => $pmr]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $slug = $user->role?->slug;
        if (!in_array($slug, ['admin', 'super-admin'])) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,under_review,approved,rejected',
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $pmr = PropertyManagementRequest::findOrFail($id);
        $pmr->status = $validated['status'];
        $pmr->admin_notes = $validated['admin_notes'] ?? $pmr->admin_notes;
        $pmr->reviewed_by = $user->id;
        $pmr->reviewed_at = now();
        $pmr->save();
        $pmr->load(['user:id,name,email']);
        $this->sendManagementStatusChangedEmail($pmr, $user->name ?? 'Admin');

        return response()->json([
            'message' => 'Request status updated successfully.',
            'data' => $pmr->load(['property:id,title,slug,address,price', 'user:id,name,email,phone', 'reviewer:id,name']),
        ]);
    }

    private function sendManagementRequestCreatedEmails(PropertyManagementRequest $pmr): void
    {
        $this->sendEmailSafe(
            $pmr->owner_email ?: $pmr->user?->email,
            'Property Management Request Submitted',
            'Request Submitted',
            "Your request for \"{$pmr->title}\" has been received.",
            [
                "Scope: {$pmr->management_scope}",
                "Status: {$pmr->status}",
                'We will review and get back to you shortly.',
            ],
            'View My Requests',
            rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/dashboard/management'
        );

        $adminEmails = User::whereHas('role', fn($q) => $q->whereIn('slug', ['admin', 'super-admin']))
            ->whereNotNull('email')
            ->pluck('email')
            ->unique()
            ->values()
            ->all();

        foreach ($adminEmails as $email) {
            $this->sendEmailSafe(
                $email,
                'New Property Management Request',
                'New Management Request',
                'A new property management request has been submitted.',
                [
                    "Owner: {$pmr->owner_name} ({$pmr->owner_email})",
                    "Property: {$pmr->title}",
                    "Address: {$pmr->address}",
                    "Scope: {$pmr->management_scope}",
                ],
                'Open Admin Dashboard',
                rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/admin/property-management'
            );
        }
    }

    private function sendManagementStatusChangedEmail(PropertyManagementRequest $pmr, string $reviewerName): void
    {
        $recipient = $pmr->owner_email ?: $pmr->user?->email;
        if (empty($recipient)) {
            return;
        }

        $this->sendEmailSafe(
            $recipient,
            'Property Management Request Status Updated',
            'Status Updated',
            "Your request for \"{$pmr->title}\" has been updated.",
            [
                "Current status: {$pmr->status}",
                "Updated by: {$reviewerName}",
                $pmr->admin_notes ? "Admin notes: {$pmr->admin_notes}" : null,
            ],
            'View My Requests',
            rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/dashboard/management'
        );
    }

    private function sendEmailSafe(?string $to, string $subject, string $title, ?string $intro, array $lines, ?string $ctaText = null, ?string $ctaUrl = null): void
    {
        if (empty($to)) {
            return;
        }

        try {
            Mail::to($to)->send(new StyledNotificationMail($subject, $title, $intro, $lines, $ctaText, $ctaUrl));
        } catch (\Throwable $e) {
            Log::warning('Failed to send management request email', [
                'to' => $to,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
