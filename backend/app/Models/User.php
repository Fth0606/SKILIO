<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Rating;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'tenant_id',
        'credits_balance',
        'total_credits_earned',
        'total_credits_spent',
        'avatar_url',
        'bio',
        'department',
        'graduation_year',
        'is_active',
        'verification_token',
        'email_verified_at',
    ];

    protected $appends = ['credits', 'sessions_count', 'skills_taught_count', 'avg_rating', 'ratings_count', 'status'];

    public function getStatusAttribute()
    {
        return $this->is_active ? 'active' : 'suspended';
    }

    public function getCreditsAttribute()
    {
        return $this->credits_balance;
    }

    public function getSessionsCountAttribute()
    {
        return $this->total_hours_learned;
    }

    public function getSkillsTaughtCountAttribute()
    {
        return $this->total_hours_taught;
    }

    public function getAvgRatingAttribute()
    {
        return (float) $this->average_rating_as_teacher;
    }

    public function getRatingsCountAttribute()
    {
        return Rating::where('rated_id', $this->id)->count();
    }

    public function ratingsReceived()
    {
        return $this->hasMany(Rating::class, 'rated_id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'skill_user')->withPivot('proficiency_level as level');
    }

    public function sessionsAsLearner()
    {
        return $this->hasMany(SessionRequest::class, 'requester_id');
    }

    public function sessionsAsTeacher()
    {
        return $this->hasMany(SessionRequest::class, 'teacher_id');
    }

    public function availability()
    {
        return $this->hasMany(UserAvailability::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }
}
