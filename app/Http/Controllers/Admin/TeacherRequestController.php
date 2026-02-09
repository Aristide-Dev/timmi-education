<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeacherRequest;
use App\Services\TeacherRequestAssignmentService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherRequestController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected TeacherRequestAssignmentService $assignmentService
    ) {
    }
    /**
     * Display a listing of teacher requests.
     */
    public function index(Request $request): Response
    {
        $status = $request->get('status');

        $query = TeacherRequest::with(['matiere', 'niveau'])->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'in_progress', 'completed', 'cancelled'])) {
            $query->where('status', $status);
        }

        $requests = $query->get();

        return Inertia::render('admin/teacher-requests/index', [
            'requests' => $requests,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    /**
     * Display the specified teacher request.
     */
    public function show(string $id): Response
    {
        $teacherRequest = TeacherRequest::with(['matiere', 'niveau', 'assignedTeacher', 'requesterUser'])
            ->where('uuid', $id)
            ->firstOrFail();

        $teachers = $this->userService->getUsersWithRole('teacher');

        return Inertia::render('admin/teacher-requests/show', [
            'request' => $teacherRequest,
            'teachers' => $teachers,
        ]);
    }

    /**
     * Update the status of a teacher request.
     */
    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $teacherRequest = TeacherRequest::where('uuid', $id)->firstOrFail();
        $teacherRequest->update(['status' => $validated['status']]);

        return redirect()->route('admin.teacher-requests.show', $teacherRequest->uuid)->with('success', 'Statut mis à jour avec succès.');
    }

    /**
     * Assign a teacher to the request and optionally create requester account (student or teacher).
     */
    public function assign(Request $request, string $id): RedirectResponse
    {
        $teacherRequest = TeacherRequest::where('uuid', $id)->firstOrFail();

        $validated = $request->validate([
            'teacher_id' => 'nullable|exists:users,id',
            'scheduled_at' => 'nullable|date',
            'create_requester_account' => 'boolean',
            'requester_role' => 'required_if:create_requester_account,true|nullable|in:student,teacher',
        ]);

        $teacherId = isset($validated['teacher_id']) && $validated['teacher_id'] !== ''
            ? (int) $validated['teacher_id']
            : null;

        if ($teacherId !== null) {
            $teachers = $this->userService->getUsersWithRole('teacher');
            if ($teachers->doesntContain('id', $teacherId)) {
                return redirect()
                    ->route('admin.teacher-requests.show', $teacherRequest->uuid)
                    ->with('error', 'L\'utilisateur sélectionné n\'est pas un professeur.');
            }
        }

        $scheduledAt = isset($validated['scheduled_at']) && $validated['scheduled_at'] !== ''
            ? Carbon::parse($validated['scheduled_at'])
            : null;

        $this->assignmentService->assign(
            $teacherRequest,
            $teacherId,
            $scheduledAt,
            (bool) ($validated['create_requester_account'] ?? false),
            $validated['requester_role'] ?? null
        );

        return redirect()
            ->route('admin.teacher-requests.show', $teacherRequest->uuid)
            ->with('success', 'Assignation enregistrée.');
    }
}
