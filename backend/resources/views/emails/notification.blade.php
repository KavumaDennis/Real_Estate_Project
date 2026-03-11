<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
</head>
<body style="margin:0;padding:0;background:#f2f4f7;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f2f4f7;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border:1px solid #d1d5db;">
                    <tr>
                        <td style="background:#0f766e;padding:18px 24px;border-bottom:1px solid #0b5f58;">
                            <p style="margin:0;font-size:12px;letter-spacing:1.4px;color:#f9fafb;font-weight:700;text-transform:uppercase;">
                                Green Wave Property Consultants
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:26px 24px;">
                            <h1 style="margin:0 0 14px;font-size:20px;line-height:1.3;color:#111827;font-weight:800;">
                                {{ $title }}
                            </h1>

                            @if(!empty($intro))
                                <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">
                                    {{ $intro }}
                                </p>
                            @endif

                            @if(!empty($lines))
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb;background:#f9fafb;margin:0 0 18px;">
                                    @foreach($lines as $line)
                                        @if(!empty($line))
                                            <tr>
                                                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;line-height:1.5;color:#1f2937;">
                                                    {{ $line }}
                                                </td>
                                            </tr>
                                        @endif
                                    @endforeach
                                </table>
                            @endif

                            @if(!empty($ctaText) && !empty($ctaUrl))
                                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
                                    <tr>
                                        <td style="background:#1d4ed8;">
                                            <a href="{{ $ctaUrl }}" style="display:inline-block;padding:11px 18px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;">
                                                {{ $ctaText }}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
                                This is an automated notification. If you need help, reply to this email.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#111827;padding:14px 24px;">
                            <p style="margin:0;font-size:11px;line-height:1.5;color:#9ca3af;">
                                &copy; {{ date('Y') }} Green Wave Property Consultants. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

