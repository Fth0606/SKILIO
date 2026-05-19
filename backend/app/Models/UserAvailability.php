<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAvailability extends Model
{
    protected $table = 'user_availability';
    protected $fillable = ['user_id', 'day_of_week', 'start_time', 'end_time', 'is_active'];
    protected $appends = ['day', 'start', 'end'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor for day name
    public function getDayAttribute()
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return $days[$this->day_of_week] ?? 'Unknown';
    }

    // Accessors for start and end
    public function getStartAttribute()
    {
        return substr($this->start_time, 0, 5);
    }

    public function getEndAttribute()
    {
        return substr($this->end_time, 0, 5);
    }
}
