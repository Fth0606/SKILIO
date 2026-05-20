<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = ['name', 'subdomain', 'email', 'is_active', 'logo_url', 'primary_color', 'secondary_color', 'max_users'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
