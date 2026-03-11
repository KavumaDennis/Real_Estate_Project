<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\StyledNotificationMail;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $fullName = trim($validated['first_name'] . ' ' . $validated['last_name']);
        $supportEmail = env('CONTACT_EMAIL', env('MAIL_FROM_ADDRESS'));
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $contactMessage = ContactMessage::create([
            'user_id' => auth()->id(),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        $this->sendEmailSafe(
            $supportEmail,
            'New Contact Form Message',
            'New Contact Message',
            'A new message has been sent from the website contact form.',
            [
                "Name: {$fullName}",
                "Email: {$validated['email']}",
                "Message: {$validated['message']}",
            ],
            'Open Website',
            $frontendUrl
        );

        $this->sendEmailSafe(
            $validated['email'],
            'We Received Your Message',
            'Message Received',
            "Hi {$validated['first_name']}, thanks for contacting us.",
            [
                'Our team has received your message and will get back to you shortly.',
                "Reference: {$fullName} - {$validated['email']}",
            ],
            'Browse Properties',
            $frontendUrl . '/properties'
        );

        return response()->json([
            'message' => 'Your message has been sent successfully.',
            'data' => [
                'id' => $contactMessage->id,
                'created_at' => $contactMessage->created_at,
            ],
        ], 201);
    }

    private function sendEmailSafe(?string $to, string $subject, string $title, ?string $intro, array $lines, ?string $ctaText = null, ?string $ctaUrl = null): void
    {
        if (empty($to)) {
            return;
        }

        try {
            Mail::to($to)->send(new StyledNotificationMail($subject, $title, $intro, $lines, $ctaText, $ctaUrl));
        } catch (\Throwable $e) {
            Log::warning('Failed to send contact email', [
                'to' => $to,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
