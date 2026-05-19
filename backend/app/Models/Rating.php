<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'session_request_id',
        'rater_id',
        'rated_id',
        'score',
        'comment',
        'tags'
    ];

    protected $casts = [
        'tags' => 'array'
    ];

    public function session()
    {
        return $this->belongsTo(SessionRequest::class, 'session_request_id');
    }

    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    public function rated()
    {
        return $this->belongsTo(User::class, 'rated_id');
    }
}
