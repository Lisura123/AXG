<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    protected $token;
    protected $email;
    protected $userName;

    /**
     * Create a new notification instance.
     */
    public function __construct($token, $email, $userName = null)
    {
        $this->token = $token;
        $this->email = $email;
        $this->userName = $userName;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $frontendUrl = env('FRONTEND_URL', 'https://www.axgphoto.com');
        // Remove trailing slash if present
        $frontendUrl = rtrim($frontendUrl, '/');
        $resetUrl = $frontendUrl . '/?page=reset-password&token=' . urlencode($this->token);
        
        // Get user name, fallback to 'there' if not provided
        $userName = $this->userName ?: ($notifiable->name ?? 'there');
        
        return (new MailMessage)
            ->subject('Reset Your Password - AXG Photo')
            ->view('emails.reset-password', [
                'userName' => $userName,
                'resetUrl' => $resetUrl,
                'token' => $this->token
            ]);
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            //
        ];
    }
}
