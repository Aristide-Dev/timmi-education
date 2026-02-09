<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\TeacherAvailabilityService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvailabilityController extends Controller
{
    public function __construct(
        protected TeacherAvailabilityService $availabilityService
    ) {
    }

    /**
     * Show the form for editing the authenticated teacher's availability.
     */
    public function edit(): Response
    {
        $teacher = auth()->user();

        if (! $teacher->hasRole('teacher')) {
            abort(403, 'Accès refusé.');
        }

        $availability = $this->availabilityService->getAvailability($teacher);

        return Inertia::render('teacher/availability-edit', [
            'teacher' => $teacher,
            'availability' => $availability,
        ]);
    }

    /**
     * Update the authenticated teacher's availability.
     */
    public function update(Request $request): RedirectResponse
    {
        $teacher = auth()->user();

        if (! $teacher->hasRole('teacher')) {
            abort(403, 'Accès refusé.');
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

        return redirect()->route('teacher.profile')
            ->with('success', 'Vos disponibilités ont été mises à jour.');
    }
}
