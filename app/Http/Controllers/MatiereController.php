<?php

namespace App\Http\Controllers;

use App\Services\MatiereService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatiereController extends Controller
{
    public function __construct(
        protected MatiereService $matiereService
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $activeOnly = $request->boolean('active_only', false);

        $matieres = $activeOnly
            ? $this->matiereService->getActiveMatieres()
            : $this->matiereService->getAllMatieres();

        return Inertia::render('matieres/index', [
            'matieres' => $matieres,
            'activeOnly' => $activeOnly,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:matieres,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->matiereService->createMatiere($validated);

        return redirect()->route('matieres.index')->with('success', 'Matière créée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $matiere = $this->matiereService->findMatiere($id);

        if (! $matiere) {
            abort(404, 'Matière non trouvée.');
        }

        return Inertia::render('matieres/show', [
            'matiere' => $matiere,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $matiere = $this->matiereService->findMatiere($id);

        if (! $matiere) {
            abort(404, 'Matière non trouvée.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:255|unique:matieres,code,'.$matiere->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $this->matiereService->updateMatiere($matiere, $validated);

        return redirect()->route('matieres.index')->with('success', 'Matière mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $matiere = $this->matiereService->findMatiere($id);

        if (! $matiere) {
            abort(404, 'Matière non trouvée.');
        }

        $this->matiereService->deleteMatiere($matiere);

        return redirect()->route('matieres.index')->with('success', 'Matière supprimée avec succès.');
    }
}
