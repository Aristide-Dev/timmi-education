<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use App\Models\Role;
use App\Services\MatiereService;
use App\Services\TeacherAvailabilityService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected MatiereService $matiereService,
        protected TeacherAvailabilityService $availabilityService
    ) {
    }

    /**
     * Display a listing of teachers.
     */
    public function index(Request $request): Response
    {
        $teachers = $this->userService->getUsersWithRole('teacher');
        $roles = Role::where('is_active', true)->get();

        return Inertia::render('admin/teachers/index', [
            'teachers' => $teachers,
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create(): Response
    {
        $matieres = $this->matiereService->getActiveMatieres();
        $niveaux = Niveau::where('is_active', true)->orderBy('ordre')->get();

        return Inertia::render('admin/teachers/create', [
            'matieres' => $matieres,
            'niveaux' => $niveaux,
        ]);
    }

    /**
     * Store a newly created teacher in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'string', PasswordRule::default(), 'confirmed'],
            'pays' => 'nullable|string|max:255',
            'region_id' => 'nullable|string|max:255',
            'prefecture_id' => 'nullable|string|max:255',
            'commune_id' => 'nullable|string|max:255',
            'quartier_id' => 'nullable|string|max:255',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'matieres' => 'nullable|array',
            'matieres.*.matiere_id' => 'required|exists:matieres,id',
            'matieres.*.niveau_id' => 'nullable|exists:niveaux,id',
        ]);

        // Set default country
        if (! isset($validated['pays'])) {
            $validated['pays'] = 'GUINEE';
        }

        // Extract matieres before creating user
        $matieresData = $validated['matieres'] ?? [];
        unset($validated['matieres']);

        // Create user with teacher role
        $teacher = $this->userService->createUser($validated);
        
        // Assign teacher role
        $teacherRole = Role::where('slug', 'teacher')->first();
        if ($teacherRole) {
            $teacher->assignRole($teacherRole);
        }

        // Assign matieres if provided
        if (! empty($matieresData)) {
            $assignments = [];
            foreach ($matieresData as $assignment) {
                $assignments[] = [
                    'matiere_id' => $assignment['matiere_id'],
                    'niveau_id' => $assignment['niveau_id'] ?? null,
                ];
            }
            $this->userService->syncMatieres($teacher, $assignments);
        }

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Professeur créé avec succès.');
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit(string $id): Response
    {
        $teacher = $this->userService->getUserWithMatieres($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        // Check if user is a teacher
        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $matieres = $this->matiereService->getActiveMatieres();
        $niveaux = Niveau::where('is_active', true)->orderBy('ordre')->get();

        return Inertia::render('admin/teachers/edit', [
            'teacher' => $teacher,
            'matieres' => $matieres,
            'niveaux' => $niveaux,
        ]);
    }

    /**
     * Update the specified teacher in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $teacher = $this->userService->findUser($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        // Check if user is a teacher
        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$teacher->id,
            'password' => ['nullable', 'string', PasswordRule::default(), 'confirmed'],
            'pays' => 'nullable|string|max:255',
            'region_id' => 'nullable|string|max:255',
            'prefecture_id' => 'nullable|string|max:255',
            'commune_id' => 'nullable|string|max:255',
            'quartier_id' => 'nullable|string|max:255',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'matieres' => 'nullable|array',
            'matieres.*' => 'exists:matieres,id',
        ]);

        // Update user
        $this->userService->updateUser($teacher, $validated);

        // Update matieres if provided
        if (isset($validated['matieres'])) {
            $this->userService->syncMatieres($teacher, $validated['matieres']);
        }

        return redirect()->route('admin.teachers.show', $teacher->id)
            ->with('success', 'Professeur mis à jour avec succès.');
    }

    /**
     * Display teacher details with matieres (authenticated).
     */
    public function show(string $id): Response
    {
        $teacher = $this->userService->getUserWithMatieres($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        // Check if user is a teacher
        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $matieres = $this->matiereService->getActiveMatieres();
        $niveaux = Niveau::where('is_active', true)->orderBy('ordre')->get();
        $availability = $this->availabilityService->getAvailability($teacher);

        return Inertia::render('admin/teachers/show', [
            'teacher' => $teacher,
            'matieres' => $matieres,
            'niveaux' => $niveaux,
            'availability' => $availability,
        ]);
    }

    /**
     * Update teacher matieres.
     */
    public function updateMatieres(Request $request, string $id): RedirectResponse
    {
        $teacher = $this->userService->findUser($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        // Check if user is a teacher
        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $validated = $request->validate([
            'matieres' => 'nullable|array',
            'matieres.*.matiere_id' => 'required|exists:matieres,id',
            'matieres.*.niveau_id' => 'nullable|exists:niveaux,id',
        ]);

        $assignments = [];
        foreach ($validated['matieres'] ?? [] as $assignment) {
            $assignments[] = [
                'matiere_id' => $assignment['matiere_id'],
                'niveau_id' => $assignment['niveau_id'] ?? null,
            ];
        }

        $this->userService->syncMatieres($teacher, $assignments);

        return redirect()->route('admin.teachers.show', $teacher->id)
            ->with('success', 'Matières mises à jour avec succès.');
    }

    /**
     * Send welcome email with password reset link (when email is not verified).
     */
    public function sendWelcomeWithPasswordReset(string $id): RedirectResponse
    {
        $teacher = $this->userService->findUser($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        if ($teacher->email_verified_at) {
            return redirect()->route('admin.teachers.show', $teacher->id)
                ->with('error', 'L\'email de ce professeur est déjà vérifié.');
        }

        $token = Password::broker(config('fortify.passwords', 'users'))->createToken($teacher);
        $passwordResetUrl = route('password.reset', [
            'token' => $token,
            'email' => $teacher->email,
        ]);

        Mail::send('emails.welcome', [
            'user' => $teacher,
            'passwordResetUrl' => $passwordResetUrl,
        ], function ($message) use ($teacher) {
            $message->to($teacher->email)
                ->subject('Bienvenue sur '.config('app.name').' – Définir votre mot de passe');
        });

        return redirect()->route('admin.teachers.show', $teacher->id)
            ->with('success', 'Email de bienvenue avec lien de réinitialisation envoyé à '.$teacher->email);
    }

    /**
     * Remove the specified teacher from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $teacher = $this->userService->findUser($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        // Check if user is a teacher
        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $this->userService->deleteUser($teacher);

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Professeur supprimé avec succès.');
    }
}

