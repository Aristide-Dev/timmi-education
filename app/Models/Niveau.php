<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Niveau extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'code',
        'ordre',
        'description',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'ordre' => 'integer',
        ];
    }

    /**
     * The users (teachers) that teach at this niveau.
     */
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'matiere_user')
            ->withPivot('matiere_id')
            ->withTimestamps();
    }

    /**
     * The matieres that can be taught at this niveau.
     */
    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'matiere_user')
            ->withPivot('user_id')
            ->withTimestamps();
    }
}
