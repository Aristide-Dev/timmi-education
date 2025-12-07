<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use App\Models\Role;
use App\Models\TeacherRequest;
use App\Services\MatiereService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherRequestController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected MatiereService $matiereService
    ) {
    }

    /**
     * Show the form for creating a new teacher request.
     */
    public function create(Request $request): Response
    {
        $filters = [
            'q' => $request->get('q'),
            'matiere' => $request->get('matiere'),
            'niveau' => $request->get('niveau'),
            'region' => $request->get('region'),
            'prefecture' => $request->get('prefecture'),
            'commune' => $request->get('commune'),
            'quartier' => $request->get('quartier'),
        ];

        // Count teachers matching the criteria
        $teachersCount = 0;
        $teacherRole = Role::where('slug', 'teacher')->first();

        if ($teacherRole) {
            $teachersQuery = $teacherRole->users();

            if ($filters['q']) {
                $teachersQuery->where(function ($q) use ($filters) {
                    $q->where('name', 'like', "%{$filters['q']}%")
                        ->orWhere('email', 'like', "%{$filters['q']}%")
                        ->orWhere('bio', 'like', "%{$filters['q']}%");
                });
            }

            if ($filters['region']) {
                $teachersQuery->where('region_id', $filters['region']);
            }

            if ($filters['prefecture']) {
                $teachersQuery->where('prefecture_id', $filters['prefecture']);
            }

            if ($filters['commune']) {
                $teachersQuery->where('commune_id', $filters['commune']);
            }

            if ($filters['quartier']) {
                $teachersQuery->where('quartier_id', $filters['quartier']);
            }

            if ($filters['matiere']) {
                $teachersQuery->whereHas('matieres', function ($q) use ($filters) {
                    $q->where('matieres.id', $filters['matiere']);
                });
            }

            if ($filters['niveau']) {
                $teachersQuery->whereHas('matieres', function ($q) use ($filters) {
                    $q->where('matiere_user.niveau_id', $filters['niveau']);
                });
            }

            $teachersCount = $teachersQuery->count();
        }

        return Inertia::render('teachers/request', [
            'matieres' => $this->matiereService->getActiveMatieres(),
            'niveaux' => Niveau::where('is_active', true)->orderBy('ordre')->get(),
            'filters' => $filters,
            'teachersCount' => $teachersCount,
        ]);
    }

    /**
     * Store a new teacher request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'matiere_id' => 'nullable|exists:matieres,id',
            'niveau_id' => 'nullable|exists:niveaux,id',
            'region_id' => 'nullable|string|max:255',
            'prefecture_id' => 'nullable|string|max:255',
            'commune_id' => 'nullable|string|max:255',
            'quartier_id' => 'nullable|string|max:255',
            'search_query' => 'nullable|string|max:255',
        ]);

        $validated['status'] = 'pending';

        TeacherRequest::create($validated);

        return redirect()->route('teacher-requests.thank-you');
    }

    /**
     * Show the thank you page.
     */
    public function thankYou(): Response
    {
        return Inertia::render('teachers/request-thank-you');
    }
}
