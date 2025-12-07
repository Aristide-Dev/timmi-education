<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $activeOnly = $request->boolean('active_only', false);

        $roles = $activeOnly
            ? $this->roleService->getActiveRoles()
            : $this->roleService->getAllRoles();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'activeOnly' => $activeOnly,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'slug' => 'nullable|string|max:255|unique:roles,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->roleService->createRole($validated);

        return redirect()->route('admin.roles.index')->with('success', 'Rôle créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $role = $this->roleService->findRole($id);

        if (! $role) {
            abort(404, 'Rôle non trouvé.');
        }

        return Inertia::render('admin/roles/show', [
            'role' => $role->load('users'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $role = $this->roleService->findRole($id);

        if (! $role) {
            abort(404, 'Rôle non trouvé.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:roles,name,'.$role->id,
            'slug' => 'nullable|string|max:255|unique:roles,slug,'.$role->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->roleService->updateRole($role, $validated);

        return redirect()->route('admin.roles.index')->with('success', 'Rôle mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $role = $this->roleService->findRole($id);

        if (! $role) {
            abort(404, 'Rôle non trouvé.');
        }

        $this->roleService->deleteRole($role);

        return redirect()->route('admin.roles.index')->with('success', 'Rôle supprimé avec succès.');
    }

    /**
     * Activate a role.
     */
    public function activate(string $id): RedirectResponse
    {
        $role = $this->roleService->findRole($id);

        if (! $role) {
            abort(404, 'Rôle non trouvé.');
        }

        $this->roleService->activateRole($role);

        return redirect()->route('admin.roles.index')->with('success', 'Rôle activé avec succès.');
    }

    /**
     * Deactivate a role.
     */
    public function deactivate(string $id): RedirectResponse
    {
        $role = $this->roleService->findRole($id);

        if (! $role) {
            abort(404, 'Rôle non trouvé.');
        }

        $this->roleService->deactivateRole($role);

        return redirect()->route('admin.roles.index')->with('success', 'Rôle désactivé avec succès.');
    }
}
