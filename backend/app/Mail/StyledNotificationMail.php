<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StyledNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $title;
    public ?string $intro;
    public array $lines;
    public ?string $ctaText;
    public ?string $ctaUrl;

    public function __construct(
        public string $mailSubject,
        string $title,
        ?string $intro = null,
        array $lines = [],
        ?string $ctaText = null,
        ?string $ctaUrl = null
    ) {
        $this->title = $title;
        $this->intro = $intro;
        $this->lines = $lines;
        $this->ctaText = $ctaText;
        $this->ctaUrl = $ctaUrl;
    }

    public function build(): self
    {
        return $this->subject($this->mailSubject)
            ->view('emails.notification');
    }
}

