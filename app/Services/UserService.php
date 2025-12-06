<?php

namespace App\Services;

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
     * Get paginated users.
     */
    public function getPaginatedUsers(int $perPage = 15)
    {
        return User::with('roles')->paginate($perPage);
    }

    /**
     * Find a user by ID or email.
     */
    public function findUser(string|int $identifier): ?User
    {
        return User::where('id', $identifier)
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
            return $role->users;
        }

        $foundRole = Role::where('slug', $role)
            ->orWhere('name', $role)
            ->orWhere('id', $role)
            ->first();

        return $foundRole ? $foundRole->users : collect();
    }

    /**
     * Verify user email.
     */
    public function verifyEmail(User $user): bool
    {
        return $user->update(['email_verified_at' => now()]);
    }
}

