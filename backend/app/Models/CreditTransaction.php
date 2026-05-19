<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditTransaction extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'session_request_id',
        'amount',
        'balance_after',
        'type',
        'description',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function session()
    {
        return $this->belongsTo(SessionRequest::class, 'session_request_id');
    }
}
