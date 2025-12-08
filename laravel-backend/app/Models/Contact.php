<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'admin_notes',
    ];

    /**
     * Mark as in progress
     */
    public function markInProgress()
    {
        $this->status = 'in_progress';
        $this->save();
    }

    /**
     * Mark as resolved
     */
    public function markResolved()
    {
        $this->status = 'resolved';
        $this->save();
    }
}
