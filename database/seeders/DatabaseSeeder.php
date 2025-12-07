<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer les rôles d'abord
        $this->call([
            RoleSeeder::class,
            NiveauSeeder::class,
            MatiereSeeder::class,
            UserSeeder::class,
        ]);
    }
}
