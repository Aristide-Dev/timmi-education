<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Matiere;
use App\Models\TeacherRequest;
use App\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Zap\Models\Concerns\HasSchedules;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasSchedules, Notifiable, TwoFactorAuthenticatable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'pays',
        'region_id',
        'prefecture_id',
        'commune_id',
        'quartier_id',
        'adresse',
        'telephone',
        'bio',
        'profile_photo_path',
        'uuid',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the profile photo URL (relative so it works on any domain).
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo_path
            ? '/storage/'.$this->profile_photo_path
            : null;
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->uuid)) {
                $user->uuid = \Illuminate\Support\Str::uuid()->toString();
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
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
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * The matieres that belong to the user (teacher).
     */
    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'matiere_user')
            ->withPivot('niveau_id')
            ->withTimestamps();
    }

    /**
     * The niveaux that the user (teacher) teaches.
     */
    public function niveaux(): BelongsToMany
    {
        return $this->belongsToMany(Niveau::class, 'matiere_user')
            ->withPivot('matiere_id')
            ->withTimestamps();
    }

    /**
     * Teacher requests assigned to this user (when user is the assigned teacher).
     */
    public function assignedTeacherRequests(): HasMany
    {
        return $this->hasMany(TeacherRequest::class, 'assigned_teacher_id');
    }

    /**
     * Teacher requests where this user was created as the requester (student or teacher account).
     */
    public function requesterTeacherRequests(): HasMany
    {
        return $this->hasMany(TeacherRequest::class, 'requester_user_id');
    }
}
