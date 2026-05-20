<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'price_monthly', 'price_yearly', 'max_users', 'features', 'published'];

    protected $casts = [
        'features' => 'array',
        'published' => 'boolean',
    ];
}
