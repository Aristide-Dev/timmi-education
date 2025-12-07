<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $users = $this->userService->getUsersExceptTeachers();
        $roles = Role::where('is_active', true)->get();

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'string', Password::default(), 'confirmed'],
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $this->userService->createUser($validated);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $user = $this->userService->findUser($id);

        if (! $user) {
            abort(404, 'Utilisateur non trouvé.');
        }

        return Inertia::render('users/show', [
            'user' => $user->load('roles'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $user = $this->userService->findUser($id);

        if (! $user) {
            abort(404, 'Utilisateur non trouvé.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $this->userService->updateUser($user, $validated);

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $user = $this->userService->findUser($id);

        if (! $user) {
            abort(404, 'Utilisateur non trouvé.');
        }

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        $this->userService->deleteUser($user);

        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé avec succès.');
    }

    /**
     * Display a listing of parents.
     */
    public function parents(Request $request): Response
    {
        $parents = $this->userService->getUsersWithRole('parent');
        $roles = Role::where('is_active', true)->get();

        return Inertia::render('users/parents', [
            'parents' => $parents,
            'roles' => $roles,
        ]);
    }

    /**
     * Display a listing of students.
     */
    public function students(Request $request): Response
    {
        $students = $this->userService->getUsersWithRole('student');
        $roles = Role::where('is_active', true)->get();

        return Inertia::render('users/students', [
            'students' => $students,
            'roles' => $roles,
        ]);
    }
}
