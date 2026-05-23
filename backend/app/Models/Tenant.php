<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'subdomain',
        'email',
        'logo_url',
        'primary_color',
        'secondary_color',
        'custom_css',
        'max_users',
        'is_active',
        'subscription_ends_at',
        'trial_ends_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function plan()
    {
        return $this->hasOneThrough(Plan::class, Subscription::class, 'tenant_id', 'id', 'id', 'plan_id');
    }
}
