<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use App\Services\MatiereService;
use App\Services\TeacherAvailabilityService;
use App\Services\UserService;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected MatiereService $matiereService,
        protected TeacherAvailabilityService $availabilityService
    ) {
    }

    /**
     * Display the authenticated teacher's profile (overview, availability, matières).
     */
    public function show(): Response
    {
        $teacher = $this->userService->getUserWithMatieres(auth()->id());

        if (! $teacher || ! $teacher->hasRole('teacher')) {
            abort(403, 'Accès refusé.');
        }

        $matieres = $this->matiereService->getActiveMatieres();
        $niveaux = Niveau::where('is_active', true)->orderBy('ordre')->get();
        $availability = $this->availabilityService->getAvailability($teacher);

        return Inertia::render('teacher/profile', [
            'teacher' => $teacher,
            'matieres' => $matieres,
            'niveaux' => $niveaux,
            'availability' => $availability,
        ]);
    }
}
