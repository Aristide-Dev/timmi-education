<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeacherRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherRequestController extends Controller
{
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
        $request = TeacherRequest::with(['matiere', 'niveau'])->where('uuid', $id)->firstOrFail();

        return Inertia::render('admin/teacher-requests/show', [
            'request' => $request,
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
}
