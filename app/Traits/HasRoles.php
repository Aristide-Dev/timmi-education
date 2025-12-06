<?php

namespace App\Traits;

use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasRoles
{
    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string|Role $role): bool
    {
        if ($role instanceof Role) {
            return $this->roles->contains('id', $role->id);
        }

        return $this->roles->contains('slug', $role) || $this->roles->contains('name', $role);
    }

    /**
     * Check if the user has any of the given roles.
     */
    public function hasAnyRole(array|string $roles): bool
    {
        $roles = is_array($roles) ? $roles : [$roles];

        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the user has all of the given roles.
     */
    public function hasAllRoles(array $roles): bool
    {
        foreach ($roles as $role) {
            if (! $this->hasRole($role)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(string|Role|int $role): void
    {
        if (is_string($role) || is_int($role)) {
            $role = Role::where('slug', $role)
                ->orWhere('name', $role)
                ->orWhere('id', $role)
                ->firstOrFail();
        }

        if (! $this->hasRole($role)) {
            $this->roles()->attach($role);
        }
    }

    /**
     * Remove a role from the user.
     */
    public function removeRole(string|Role|int $role): void
    {
        if (is_string($role) || is_int($role)) {
            $role = Role::where('slug', $role)
                ->orWhere('name', $role)
                ->orWhere('id', $role)
                ->firstOrFail();
        }

        $this->roles()->detach($role);
    }

    /**
     * Sync roles for the user.
     */
    public function syncRoles(array $roles): void
    {
        $roleIds = [];

        foreach ($roles as $role) {
            if ($role instanceof Role) {
                $roleIds[] = $role->id;
            } else {
                $foundRole = Role::where('slug', $role)
                    ->orWhere('name', $role)
                    ->orWhere('id', $role)
                    ->first();

                if ($foundRole) {
                    $roleIds[] = $foundRole->id;
                }
            }
        }

        $this->roles()->sync($roleIds);
    }

    /**
     * Get the user's role names.
     */
    public function getRoleNames(): array
    {
        return $this->roles->pluck('name')->toArray();
    }

    /**
     * Get the user's role slugs.
     */
    public function getRoleSlugs(): array
    {
        return $this->roles->pluck('slug')->toArray();
    }
}

