<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TeacherAvailabilityService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherAvailabilityController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected TeacherAvailabilityService $availabilityService
    ) {
    }

    /**
     * Show the form for editing the teacher's availability.
     */
    public function edit(string $id): Response|RedirectResponse
    {
        $teacher = $this->userService->findUser($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $availability = $this->availabilityService->getAvailability($teacher);

        return Inertia::render('admin/teachers/availability-edit', [
            'teacher' => $teacher,
            'availability' => $availability,
        ]);
    }

    /**
     * Update the teacher's availability.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $teacher = $this->userService->findUser($id);

        if (! $teacher) {
            abort(404, 'Professeur non trouvé.');
        }

        if (! $teacher->hasRole('teacher')) {
            abort(404, 'Cet utilisateur n\'est pas un professeur.');
        }

        $validated = $request->validate([
            'availability' => 'required|array',
            'availability.monday' => 'nullable|array',
            'availability.tuesday' => 'nullable|array',
            'availability.wednesday' => 'nullable|array',
            'availability.thursday' => 'nullable|array',
            'availability.friday' => 'nullable|array',
            'availability.saturday' => 'nullable|array',
            'availability.sunday' => 'nullable|array',
            'availability.*.*.start' => 'required|string|regex:/^\d{1,2}:\d{2}$/',
            'availability.*.*.end' => 'required|string|regex:/^\d{1,2}:\d{2}$/',
        ]);

        $this->availabilityService->saveAvailability($teacher, $validated['availability']);

        return redirect()->route('admin.teachers.show', $teacher->id)
            ->with('success', 'Disponibilités mises à jour avec succès.');
    }
}
