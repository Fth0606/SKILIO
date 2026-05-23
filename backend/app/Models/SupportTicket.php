<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'session_request_id',
        'subject',
        'message',
        'status',
        'priority',
        'assigned_to',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function sessionRequest()
    {
        return $this->belongsTo(SessionRequest::class);
    }

    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }
}