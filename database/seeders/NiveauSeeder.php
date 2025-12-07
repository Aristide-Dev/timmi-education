<?php

namespace Database\Seeders;

use App\Models\Niveau;
use Illuminate\Database\Seeder;

class NiveauSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveaux = [
            [
                'name' => 'Primaire',
                'slug' => 'primaire',
                'code' => 'PRIM',
                'ordre' => 1,
                'description' => 'Niveau primaire (CP1 à CM2)',
                'is_active' => true,
            ],
            [
                'name' => 'Collège',
                'slug' => 'college',
                'code' => 'COLL',
                'ordre' => 2,
                'description' => 'Niveau collège (6ème à 3ème)',
                'is_active' => true,
            ],
            [
                'name' => 'Lycée',
                'slug' => 'lycee',
                'code' => 'LYC',
                'ordre' => 3,
                'description' => 'Niveau lycée (2nde à Terminale)',
                'is_active' => true,
            ],
            [
                'name' => 'Université',
                'slug' => 'universite',
                'code' => 'UNIV',
                'ordre' => 4,
                'description' => 'Niveau universitaire',
                'is_active' => true,
            ],
            [
                'name' => 'Formation professionnelle',
                'slug' => 'formation-professionnelle',
                'code' => 'FPRO',
                'ordre' => 5,
                'description' => 'Formation professionnelle et technique',
                'is_active' => true,
            ],
        ];

        foreach ($niveaux as $niveau) {
            Niveau::updateOrCreate(
                ['slug' => $niveau['slug']],
                $niveau
            );
        }
    }
}
