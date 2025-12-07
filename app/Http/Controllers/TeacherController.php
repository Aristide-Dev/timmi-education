<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use App\Services\MatiereService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function __construct(
        protected MatiereService $matiereService
    ) {
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
     * Public display of teacher details.
     */
    public function showPublic(string $id): Response
    {
        $teacher = app(\App\Services\UserService::class)->getUserWithMatieres($id);

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
}
