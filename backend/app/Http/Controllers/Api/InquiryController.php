<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\StyledNotificationMail;
use App\Models\Inquiry;
use App\Http\Resources\InquiryResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Inquiry::with(['property.images', 'user', 'agent']);

        // Agents see inquiries for their properties AND direct contacts to them
        if ($user->role?->slug === 'agent') {
            $query->where(function ($q) use ($user) {
                $q->whereHas('property', function ($inner) use ($user) {
                    $inner->where('agent_id', $user->id);
                })->orWhere('agent_id', $user->id);
            });
        } elseif (!in_array($user->role?->slug, ['admin', 'super-admin'], true)) {
            // Regular users see their own inquiries
            $query->where('user_id', $user->id);
        }

        $inquiries = $query->latest()->paginate(15);

        return InquiryResource::collection($inquiries);
    }

    public function update(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $user = $request->user();

        if (!$this->canManageInquiry($user, $inquiry)) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,closed'
        ]);

        $inquiry->update($validated);

        return new InquiryResource($inquiry->load(['property.images', 'user', 'agent']));
    }

    public function destroy(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $user = $request->user();

        if (!$this->canManageInquiry($user, $inquiry)) {
            abort(403);
        }

        $inquiry->delete();

        return response()->json(['message' => 'Inquiry deleted successfully']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'agent_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        if (!$request->property_id && !$request->agent_id) {
            return response()->json(['message' => 'Either property_id or agent_id is required.'], 422);
        }

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';

        $inquiry = Inquiry::create($validated);
        $inquiry->load(['property', 'agent']);
        $this->sendInquiryEmails($inquiry);

        return new InquiryResource($inquiry->load(['property.images', 'user', 'agent']));
    }

    private function sendInquiryEmails(Inquiry $inquiry): void
    {
        $propertyTitle = $inquiry->property?->title ?? 'your listing';
        $propertyAddress = $inquiry->property?->address ?? '';
        $agentEmail = $inquiry->agent?->email ?? $inquiry->property?->agent?->email;

        if (!empty($agentEmail)) {
            $this->sendEmailSafe(
                $agentEmail,
                'New Property Inquiry Received',
                'New Property Inquiry',
                "A new inquiry has been submitted for {$propertyTitle}.",
                [
                    "Name: {$inquiry->name}",
                    "Email: {$inquiry->email}",
                    "Phone: " . ($inquiry->phone ?: 'N/A'),
                    "Message: {$inquiry->message}",
                    $propertyAddress ? "Address: {$propertyAddress}" : null,
                ],
                'Open Dashboard',
                rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/dashboard/leads'
            );
        }

        if (!empty($inquiry->email)) {
            $this->sendEmailSafe(
                $inquiry->email,
                'We Received Your Property Inquiry',
                'Inquiry Received',
                "Thanks {$inquiry->name}, we have received your request.",
                [
                    "Property: {$propertyTitle}",
                    $propertyAddress ? "Address: {$propertyAddress}" : null,
                    "Our team will contact you shortly.",
                ],
                'Browse Properties',
                rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . '/properties'
            );
        }
    }

    private function sendEmailSafe(string $to, string $subject, string $title, ?string $intro, array $lines, ?string $ctaText = null, ?string $ctaUrl = null): void
    {
        try {
            Mail::to($to)->send(new StyledNotificationMail($subject, $title, $intro, $lines, $ctaText, $ctaUrl));
        } catch (\Throwable $e) {
            Log::warning('Failed to send inquiry email', [
                'to' => $to,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function canManageInquiry($user, Inquiry $inquiry): bool
    {
        $role = $user->role?->slug;

        if (in_array($role, ['admin', 'super-admin'], true)) {
            return true;
        }

        if ($inquiry->user_id === $user->id) {
            return true;
        }

        if ($inquiry->agent_id === $user->id) {
            return true;
        }

        return (int) optional($inquiry->property)->agent_id === (int) $user->id;
    }
}
