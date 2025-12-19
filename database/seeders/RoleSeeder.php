<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Administrateur',
                'slug' => 'super-admin',
                'description' => 'Accès complet à toutes les fonctionnalités du système et gestion de la plateforme',
                'is_active' => true,
            ],
            [
                'name' => 'Administrateur',
                'slug' => 'admin',
                'description' => 'Accès complet à toutes les fonctionnalités du système et gestion de la plateforme',
                'is_active' => true,
            ],
            [
                'name' => 'Professeur',
                'slug' => 'teacher',
                'description' => 'Enseignant pouvant créer des cours, gérer des élèves et communiquer avec les parents',
                'is_active' => true,
            ],
            [
                'name' => 'Parent d\'élève',
                'slug' => 'parent',
                'description' => 'Parent pouvant suivre la progression de ses enfants et communiquer avec les professeurs',
                'is_active' => true,
            ],
            [
                'name' => 'Élève',
                'slug' => 'student',
                'description' => 'Élève pouvant accéder à ses cours, devoirs et communiquer avec ses professeurs',
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}

