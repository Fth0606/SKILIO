<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionRequest extends Model
{
    protected $fillable = [
        'requester_id',
        'teacher_id',
        'skill_id',
        'status',
        'scheduled_at',
        'notes',
        'credits_held',
        'requester_confirmed',
        'teacher_confirmed',
        'requester_rated',
        'teacher_rated',
        'meeting_place_title',
        'meeting_place_address',
        'meeting_place_map_link',
        'meeting_place_room',
        'meeting_place_notes',
        'meeting_place_status',
        'meeting_place_proposed_by',
        'meeting_place_change_reason',
        'meeting_place_history',
        'meeting_place_updated_at',
    ];

    protected $casts = [
        'requester_confirmed' => 'boolean',
        'teacher_confirmed' => 'boolean',
        'requester_rated' => 'boolean',
        'teacher_rated' => 'boolean',
        'meeting_place_history' => 'array',
        'meeting_place_updated_at' => 'datetime',
    ];
}
