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
        'plan_id'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
