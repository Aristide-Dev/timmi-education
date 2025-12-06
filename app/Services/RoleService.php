<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class RoleService
{
    /**
     * Get all active roles.
     */
    public function getActiveRoles(): Collection
    {
        return Role::where('is_active', true)->get();
    }

    /**
     * Get all roles.
     */
    public function getAllRoles(): Collection
    {
        return Role::all();
    }

    /**
     * Find a role by ID, slug, or name.
     */
    public function findRole(string|int $identifier): ?Role
    {
        return Role::where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->orWhere('name', $identifier)
            ->first();
    }

    /**
     * Create a new role.
     */
    public function createRole(array $data): Role
    {
        if (! isset($data['slug']) && isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return Role::create($data);
    }

    /**
     * Update a role.
     */
    public function updateRole(Role $role, array $data): bool
    {
        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $role->update($data);
    }

    /**
     * Delete a role.
     */
    public function deleteRole(Role $role): bool
    {
        return $role->delete();
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

        $foundRole = $this->findRole($role);

        return $foundRole ? $foundRole->users : collect();
    }

    /**
     * Check if a role exists.
     */
    public function roleExists(string|int $identifier): bool
    {
        return $this->findRole($identifier) !== null;
    }

    /**
     * Activate a role.
     */
    public function activateRole(Role $role): bool
    {
        return $role->update(['is_active' => true]);
    }

    /**
     * Deactivate a role.
     */
    public function deactivateRole(Role $role): bool
    {
        return $role->update(['is_active' => false]);
    }
}

