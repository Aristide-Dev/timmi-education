<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ex: Primaire, Collège, Lycée, Université
            $table->string('slug')->unique(); // Ex: primaire, college, lycee, universite
            $table->string('code')->unique(); // Ex: PRIM, COLL, LYC, UNIV
            $table->integer('ordre')->default(0); // Pour l'ordre d'affichage
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('niveaux');
    }
};
