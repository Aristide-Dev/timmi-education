<?php

namespace Database\Seeders;

use App\Models\Matiere;
use Illuminate\Database\Seeder;

class MatiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $matieres = [
            [
                'name' => 'Mathématiques',
                'code' => 'MATH',
                'description' => 'Mathématiques : algèbre, géométrie, analyse',
                'is_active' => true,
            ],
            [
                'name' => 'Français',
                'code' => 'FR',
                'description' => 'Langue française : grammaire, littérature, expression écrite et orale',
                'is_active' => true,
            ],
            [
                'name' => 'Histoire-Géographie',
                'code' => 'HIST-GEO',
                'description' => 'Histoire et géographie : événements historiques et géographie du monde',
                'is_active' => true,
            ],
            [
                'name' => 'Sciences de la Vie et de la Terre',
                'code' => 'SVT',
                'description' => 'Sciences de la vie et de la terre : biologie, géologie',
                'is_active' => true,
            ],
            [
                'name' => 'Physique-Chimie',
                'code' => 'PC',
                'description' => 'Physique et chimie : mécanique, électricité, réactions chimiques',
                'is_active' => true,
            ],
            [
                'name' => 'Anglais',
                'code' => 'ANG',
                'description' => 'Langue anglaise : grammaire, vocabulaire, compréhension et expression',
                'is_active' => true,
            ],
            [
                'name' => 'Espagnol',
                'code' => 'ESP',
                'description' => 'Langue espagnole : grammaire, vocabulaire, compréhension et expression',
                'is_active' => true,
            ],
            [
                'name' => 'Éducation Physique et Sportive',
                'code' => 'EPS',
                'description' => 'Éducation physique et sportive : activités sportives et développement physique',
                'is_active' => true,
            ],
            [
                'name' => 'Arts Plastiques',
                'code' => 'ARTS',
                'description' => 'Arts plastiques : dessin, peinture, sculpture',
                'is_active' => true,
            ],
            [
                'name' => 'Musique',
                'code' => 'MUS',
                'description' => 'Musique : théorie musicale, pratique instrumentale',
                'is_active' => true,
            ],
        ];

        foreach ($matieres as $matiere) {
            Matiere::firstOrCreate(
                ['code' => $matiere['code']],
                $matiere
            );
        }
    }
}
