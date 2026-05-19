<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'category', 'description', 'tenant_id', 'is_global'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'skill_user')->withPivot('proficiency_level as level');
    }}
