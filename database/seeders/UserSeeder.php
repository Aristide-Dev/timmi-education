<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les rôles
        $adminRole = Role::where('slug', 'admin')->first();
        $teacherRole = Role::where('slug', 'teacher')->first();
        $parentRole = Role::where('slug', 'parent')->first();
        $studentRole = Role::where('slug', 'student')->first();

        // Créer un utilisateur Administrateur
        if ($adminRole) {
            $admin = User::firstOrCreate(
                ['email' => 'admin@timmi.com'],
                [
                    'name' => 'Administrateur',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $admin->assignRole($adminRole);
            $this->command->info('Utilisateur Administrateur créé : admin@timmi.com');
        }

        // Créer un utilisateur Professeur
        if ($teacherRole) {
            $teacher = User::firstOrCreate(
                ['email' => 'professeur@timmi.com'],
                [
                    'name' => 'Marie Dupont',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $teacher->assignRole($teacherRole);
            $this->command->info('Utilisateur Professeur créé : professeur@timmi.com');
        }

        // Créer un utilisateur Parent d'élève
        if ($parentRole) {
            $parent = User::firstOrCreate(
                ['email' => 'parent@timmi.com'],
                [
                    'name' => 'Jean Martin',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $parent->assignRole($parentRole);
            $this->command->info('Utilisateur Parent créé : parent@timmi.com');
        }

        // Créer un utilisateur Élève
        if ($studentRole) {
            $student = User::firstOrCreate(
                ['email' => 'eleve@timmi.com'],
                [
                    'name' => 'Lucas Martin',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $student->assignRole($studentRole);
            $this->command->info('Utilisateur Élève créé : eleve@timmi.com');
        }

        $this->command->info('Tous les utilisateurs avec leurs rôles ont été créés avec succès !');
        $this->command->warn('Mot de passe par défaut pour tous les utilisateurs : password');
    }
}
