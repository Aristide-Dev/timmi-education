<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\TeacherRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        
        // Statistiques de base
        $stats = [
            'total_users' => User::count(),
            'total_teacher_requests' => TeacherRequest::count(),
            'total_roles' => Role::count(),
        ];

        // Statistiques par rôle
        $stats['users_by_role'] = Role::withCount('users')
            ->get()
            ->map(fn($role) => [
                'name' => $role->name,
                'slug' => $role->slug,
                'count' => $role->users_count,
            ]);

        // Statistiques des demandes de professeurs
        $stats['teacher_requests_stats'] = [
            'total' => TeacherRequest::count(),
            'pending' => TeacherRequest::where('status', 'pending')->count(),
            'approved' => TeacherRequest::where('status', 'approved')->count(),
            'rejected' => TeacherRequest::where('status', 'rejected')->count(),
        ];

        // Utilisateurs récents (pour admin et super-admin)
        if ($user->hasAnyRole(['admin', 'super-admin'])) {
            $stats['recent_users'] = User::with('roles')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'created_at' => $u->created_at->format('d/m/Y H:i'),
                    'roles' => $u->roles->pluck('name'),
                ]);

            // Demandes récentes de professeurs
            $stats['recent_teacher_requests'] = TeacherRequest::with(['matiere', 'niveau'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn($request) => [
                    'id' => $request->id,
                    'uuid' => $request->uuid,
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'matiere' => $request->matiere?->nom,
                    'niveau' => $request->niveau?->nom,
                    'status' => $request->status,
                    'created_at' => $request->created_at->format('d/m/Y H:i'),
                ]);
        }

        // Statistiques spécifiques pour les professeurs
        if ($user->hasRole('teacher')) {
            $stats['teacher_stats'] = [
                'total_matieres' => $user->matieres()->count(),
                'total_niveaux' => $user->niveaux()->distinct()->count(),
            ];
        }

        // Statistiques spécifiques pour les élèves
        if ($user->hasRole('student')) {
            $stats['student_stats'] = [
                // Vous pouvez ajouter ici des stats spécifiques aux élèves
                // Par exemple: cours suivis, devoirs, etc.
            ];
        }

        // Statistiques spécifiques pour les parents
        if ($user->hasRole('parent')) {
            $stats['parent_stats'] = [
                // Vous pouvez ajouter ici des stats spécifiques aux parents
                // Par exemple: nombre d'enfants, progression, etc.
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
