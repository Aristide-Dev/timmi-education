<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use App\Models\Role;
use App\Services\MatiereService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected MatiereService $matiereService
    ) {
    }

    /**
     * Display a listing of teachers.
     */
    public function index(Request $request): Response
    {
        $teachers = $this->userService->getUsersWithRole('teacher');
        $roles = Role::where('is_active', true)->get();

        return Inertia::render('teachers/index', [
            'teachers' => $teachers,
            'roles' => $roles,
        ]);
    }

    /**
     * Public search page for teachers.
     */
    public function search(Request $request)
    {
        // Check if there are any search parameters
        $hasParams = $request->has('q') || $request->has('matiere') || $request->has('niveau') 
            || $request->has('region') || $request->has('prefecture') 
            || $request->has('commune') || $request->has('quartier');

        // If there are search parameters, redirect to teacher request page
        if ($hasParams) {
            // Build query parameters for redirect
            $queryParams = [];
            
            if ($request->has('q') && $request->get('q')) {
                $queryParams['q'] = $request->get('q');
            }
            if ($request->has('matiere') && $request->get('matiere')) {
                $queryParams['matiere'] = $request->get('matiere');
            }
            if ($request->has('niveau') && $request->get('niveau')) {
                $queryParams['niveau'] = $request->get('niveau');
            }
            if ($request->has('region') && $request->get('region')) {
                $queryParams['region'] = $request->get('region');
            }
            if ($request->has('prefecture') && $request->get('prefecture')) {
                $queryParams['prefecture'] = $request->get('prefecture');
            }
            if ($request->has('commune') && $request->get('commune')) {
                $queryParams['commune'] = $request->get('commune');
            }
            if ($request->has('quartier') && $request->get('quartier')) {
                $queryParams['quartier'] = $request->get('quartier');
            }

            // Redirect to teacher request page with search parameters as query string
            $url = route('teacher-requests.create');
            if (!empty($queryParams)) {
                $url .= '?' . http_build_query($queryParams);
            }
            return redirect($url);
        }

        // If no parameters, show the search form page
        return Inertia::render('teachers/search', [
            'matieres' => $this->matiereService->getActiveMatieres(),
            'niveaux' => Niveau::where('is_active', true)->orderBy('ordre')->get(),
            'filters' => [
                'q' => '',
                'matiere' => '',
                'niveau' => '',
                'region' => '',
                'prefecture' => '',
                'commune' => '',
                'quartier' => '',
            ],
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create(): Response
    {
        $matieres = $this->matiereService->getActiveMatieres();
        $niveaux = Niveau::where('is_active', true)->orderBy('ordre')->get();

        return Inertia::render('teachers/create', [
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
            'password' => ['required', 'string', Password::default(), 'confirmed'],
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

        return redirect()->route('teachers.index')
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

        return Inertia::render('teachers/edit', [
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
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
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

        return redirect()->route('teachers.show', $teacher->id)
            ->with('success', 'Professeur mis à jour avec succès.');
    }

    /**
     * Public display of teacher details.
     */
    public function showPublic(string $id): Response
    {
        $teacher = $this->userService->getUserWithMatieres($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        // Check if user is a teacher
        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        // Load niveaux and map matieres to include niveau slug in pivot
        $niveaux = Niveau::where('is_active', true)->orderBy('ordre')->get();
        $niveauxMap = $niveaux->keyBy('id');

        // Add niveau slug to each matiere pivot
        if ($teacher->matieres) {
            $teacher->matieres->each(function ($matiere) use ($niveauxMap) {
                if ($matiere->pivot && isset($matiere->pivot->niveau_id)) {
                    $niveau = $niveauxMap->get($matiere->pivot->niveau_id);
                    if ($niveau) {
                        $matiere->pivot->niveau_slug = $niveau->slug;
                    }
                }
            });
        }

        return Inertia::render('teachers/show-public', [
            'teacher' => $teacher,
            'niveaux' => $niveaux,
        ]);
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

        return Inertia::render('teachers/show', [
            'teacher' => $teacher,
            'matieres' => $matieres,
            'niveaux' => $niveaux,
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

        return redirect()->route('teachers.show', $teacher->id)
            ->with('success', 'Matières mises à jour avec succès.');
    }
}

