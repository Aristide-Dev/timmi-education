<?php

namespace App\Services;

use App\Models\Matiere;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Get all users with their roles.
     */
    public function getAllUsers(): Collection
    {
        return User::with('roles')->get();
    }

    /**
     * Get all users except teachers.
     */
    public function getUsersExceptTeachers(): Collection
    {
        $teacherRole = Role::where('slug', 'teacher')
            ->orWhere('name', 'teacher')
            ->first();

        if (! $teacherRole) {
            return User::with('roles')->get();
        }

        return User::with('roles')
            ->whereDoesntHave('roles', function ($query) use ($teacherRole) {
                $query->where('roles.id', $teacherRole->id);
            })
            ->get();
    }

    /**
     * Get paginated users.
     */
    public function getPaginatedUsers(int $perPage = 15)
    {
        return User::with('roles')->paginate($perPage);
    }

    /**
     * Find a user by UUID, ID or email.
     */
    public function findUser(string|int $identifier): ?User
    {
        return User::where('uuid', $identifier)
            ->orWhere('id', $identifier)
            ->orWhere('email', $identifier)
            ->first();
    }

    /**
     * Create a new user.
     */
    public function createUser(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user = User::create($data);

        // Assign roles if provided
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return $user->load('roles');
    }

    /**
     * Update a user.
     */
    public function updateUser(User $user, array $data): bool
    {
        // Handle password update
        if (isset($data['password']) && ! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $updated = $user->update($data);

        // Sync roles if provided
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return $updated;
    }

    /**
     * Delete a user.
     */
    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Assign a role to a user.
     */
    public function assignRoleToUser(User $user, string|Role|int $role): void
    {
        $user->assignRole($role);
    }

    /**
     * Remove a role from a user.
     */
    public function removeRoleFromUser(User $user, string|Role|int $role): void
    {
        $user->removeRole($role);
    }

    /**
     * Sync roles for a user.
     */
    public function syncUserRoles(User $user, array $roles): void
    {
        $user->syncRoles($roles);
    }

    /**
     * Get users with a specific role.
     */
    public function getUsersWithRole(string|Role|int $role): Collection
    {
        if ($role instanceof Role) {
            return $role->users()->with('roles')->get();
        }

        $foundRole = Role::where('slug', $role)
            ->orWhere('name', $role)
            ->orWhere('id', $role)
            ->first();

        return $foundRole ? $foundRole->users()->with('roles')->get() : collect();
    }

    /**
     * Get teachers with optional search and email_verified filter.
     *
     * @param  array{search?: string, email_verified?: string}  $filters
     */
    public function getTeachersFiltered(array $filters = []): Collection
    {
        $teacherRole = Role::where('slug', 'teacher')->orWhere('name', 'teacher')->first();
        if (! $teacherRole) {
            return collect();
        }

        $query = User::with('roles')
            ->whereHas('roles', fn ($q) => $q->where('roles.id', $teacherRole->id));

        if (! empty($filters['search'])) {
            $term = '%'.addcslashes($filters['search'], '%_').'%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)->orWhere('email', 'like', $term);
            });
        }

        if (isset($filters['email_verified'])) {
            if ($filters['email_verified'] === '1') {
                $query->whereNotNull('email_verified_at');
            } elseif ($filters['email_verified'] === '0') {
                $query->whereNull('email_verified_at');
            }
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get users except teachers with optional search and role filter.
     *
     * @param  array{search?: string, role?: string}  $filters
     */
    public function getUsersExceptTeachersFiltered(array $filters = []): Collection
    {
        $teacherRole = Role::where('slug', 'teacher')->orWhere('name', 'teacher')->first();
        if (! $teacherRole) {
            $query = User::with('roles')->newQuery();
        } else {
            $query = User::with('roles')
                ->whereDoesntHave('roles', fn ($q) => $q->where('roles.id', $teacherRole->id));
        }

        if (! empty($filters['search'])) {
            $term = '%'.addcslashes($filters['search'], '%_').'%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)->orWhere('email', 'like', $term);
            });
        }

        if (! empty($filters['role'])) {
            $query->whereHas('roles', fn ($q) => $q->where('roles.id', (int) $filters['role']));
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Verify user email.
     */
    public function verifyEmail(User $user): bool
    {
        return $user->update(['email_verified_at' => now()]);
    }

    /**
     * Get user with matieres loaded.
     */
    public function getUserWithMatieres(string|int $identifier): ?User
    {
        return User::where('uuid', $identifier)
            ->orWhere('id', $identifier)
            ->orWhere('email', $identifier)
            ->with(['roles', 'matieres' => function ($query) {
                $query->withPivot('niveau_id');
            }])
            ->first();
    }

    /**
     * Assign matieres to a user (teacher) with niveaux.
     * 
     * @param array $assignments Array of ['matiere_id' => int, 'niveau_id' => int|null]
     */
    public function assignMatieres(User $user, array $assignments): void
    {
        $syncData = [];
        foreach ($assignments as $assignment) {
            $key = $assignment['matiere_id'];
            $syncData[$key] = ['niveau_id' => $assignment['niveau_id'] ?? null];
        }
        $user->matieres()->sync($syncData);
    }

    /**
     * Add a matiere to a user (teacher).
     */
    public function addMatiere(User $user, string|Matiere|int $matiere): void
    {
        if (is_string($matiere) || is_int($matiere)) {
            $matiere = Matiere::where('id', $matiere)
                ->orWhere('code', $matiere)
                ->firstOrFail();
        }

        if (! $user->matieres->contains('id', $matiere->id)) {
            $user->matieres()->attach($matiere);
        }
    }

    /**
     * Remove a matiere from a user (teacher).
     */
    public function removeMatiere(User $user, string|Matiere|int $matiere): void
    {
        if (is_string($matiere) || is_int($matiere)) {
            $matiere = Matiere::where('id', $matiere)
                ->orWhere('code', $matiere)
                ->firstOrFail();
        }

        $user->matieres()->detach($matiere);
    }

    /**
     * Sync matieres for a user (teacher) with niveaux.
     * 
     * @param array $assignments Array of ['matiere_id' => int, 'niveau_id' => int|null]
     */
    public function syncMatieres(User $user, array $assignments): void
    {
        $syncData = [];
        foreach ($assignments as $assignment) {
            if (is_array($assignment)) {
                $matiereId = $assignment['matiere_id'] ?? $assignment['id'] ?? $assignment;
                $niveauId = $assignment['niveau_id'] ?? null;
                $syncData[$matiereId] = ['niveau_id' => $niveauId];
            } else {
                // Backward compatibility: if just an ID is passed
                $syncData[$assignment] = ['niveau_id' => null];
            }
        }
        $user->matieres()->sync($syncData);
    }

    /**
     * Get matieres assigned to a user (teacher).
     */
    public function getUserMatieres(User $user): Collection
    {
        return $user->matieres;
    }
}

