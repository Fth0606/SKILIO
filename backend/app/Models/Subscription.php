<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'stripe_id',
        'stripe_status',
        'stripe_price',
        'quantity',
        'price',
        'billing_cycle',
        'status',
        'trial_ends_at',
        'ends_at',
        'starts_at',
    ];

    protected $casts = [
        'price' => 'float',
        'trial_ends_at' => 'datetime',
        'ends_at' => 'datetime',
        'starts_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function isActive()
    {
        return $this->status === 'active';
    }
}
