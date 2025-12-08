<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            '_id' => (string)$this->id, // For backwards compatibility
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'isActive' => $this->is_active,
            'isEmailVerified' => $this->is_email_verified,
            'avatar' => $this->avatar,
            'address' => [
                'street' => $this->address_street,
                'city' => $this->address_city,
                'state' => $this->address_state,
                'zipCode' => $this->address_zip_code,
                'country' => $this->address_country,
            ],
            'preferences' => [
                'emailNotifications' => $this->pref_email_notifications,
                'smsNotifications' => $this->pref_sms_notifications,
                'newsletter' => $this->pref_newsletter,
            ],
            'lastLogin' => $this->last_login,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
