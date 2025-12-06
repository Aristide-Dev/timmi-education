<?php

namespace App\Services;

use App\Models\Matiere;
use Illuminate\Database\Eloquent\Collection;

class MatiereService
{
    /**
     * Get all active matieres.
     */
    public function getActiveMatieres(): Collection
    {
        return Matiere::where('is_active', true)->get();
    }

    /**
     * Get all matieres.
     */
    public function getAllMatieres(): Collection
    {
        return Matiere::all();
    }

    /**
     * Find a matiere by ID or code.
     */
    public function findMatiere(string|int $identifier): ?Matiere
    {
        return Matiere::where('id', $identifier)
            ->orWhere('code', $identifier)
            ->first();
    }

    /**
     * Create a new matiere.
     */
    public function createMatiere(array $data): Matiere
    {
        return Matiere::create($data);
    }

    /**
     * Update a matiere.
     */
    public function updateMatiere(Matiere $matiere, array $data): bool
    {
        return $matiere->update($data);
    }

    /**
     * Delete a matiere.
     */
    public function deleteMatiere(Matiere $matiere): bool
    {
        return $matiere->delete();
    }

    /**
     * Activate a matiere.
     */
    public function activateMatiere(Matiere $matiere): bool
    {
        return $matiere->update(['is_active' => true]);
    }

    /**
     * Deactivate a matiere.
     */
    public function deactivateMatiere(Matiere $matiere): bool
    {
        return $matiere->update(['is_active' => false]);
    }
}

