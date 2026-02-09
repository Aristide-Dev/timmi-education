<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherRequest extends Model
{
    use HasFactory;

    protected $table = 'teacher_requests';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'matiere_id',
        'niveau_id',
        'region_id',
        'prefecture_id',
        'commune_id',
        'quartier_id',
        'search_query',
        'status',
        'uuid',
        'assigned_teacher_id',
        'requester_user_id',
        'scheduled_at',
    ];

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

        static::creating(function ($request) {
            if (empty($request->uuid)) {
                $request->uuid = \Illuminate\Support\Str::uuid()->toString();
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'string',
            'scheduled_at' => 'datetime',
        ];
    }

    /**
     * Get the matiere for this request.
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }

    /**
     * Get the niveau for this request.
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(Niveau::class);
    }

    /**
     * Get the teacher assigned to this request.
     */
    public function assignedTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_teacher_id');
    }

    /**
     * Get the user account created for the requester (student or teacher).
     */
    public function requesterUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_user_id');
    }
}
