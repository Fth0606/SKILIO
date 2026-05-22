<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'max_users',
        'features',
        'is_active',
        'is_public'
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
    ];
}
