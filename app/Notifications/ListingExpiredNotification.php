<?php

namespace App\Notifications;

use App\Domain\Rental\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ListingExpiredNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly Listing $listing) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tin đăng đã hết hạn')
            ->line("Tin đăng \"{$this->listing->title}\" đã hết hạn.")
            ->action('Gia hạn tin đăng', route('landlord.listings.index'));
    }
}
