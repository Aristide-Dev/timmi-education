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
        Schema::create('teacher_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message')->nullable();
            
            // Critères de recherche
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('niveau_id')->nullable()->constrained()->onDelete('set null');
            $table->string('region_id')->nullable();
            $table->string('prefecture_id')->nullable();
            $table->string('search_query')->nullable(); // Pour la recherche par nom/email/bio
            
            // Statut de la demande
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_requests');
    }
};
