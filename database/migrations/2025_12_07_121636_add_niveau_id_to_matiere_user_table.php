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
        Schema::table('matiere_user', function (Blueprint $table) {
            // First, add niveau_id column without foreign key constraint
            $table->unsignedBigInteger('niveau_id')->nullable()->after('matiere_id');

            // Drop foreign key constraints temporarily
            $table->dropForeign(['user_id']);
            $table->dropForeign(['matiere_id']);

            // Drop the old unique constraint
            $table->dropUnique(['user_id', 'matiere_id']);

            // Recreate foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('matiere_id')->references('id')->on('matieres')->onDelete('cascade');

            // Add foreign key constraint for niveau_id
            $table->foreign('niveau_id')->references('id')->on('niveaux')->onDelete('cascade');

            // Create new unique constraint with niveau_id
            $table->unique(['user_id', 'matiere_id', 'niveau_id'], 'user_matiere_niveau_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matiere_user', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('user_matiere_niveau_unique');

            // Drop foreign key constraints temporarily
            $table->dropForeign(['user_id']);
            $table->dropForeign(['matiere_id']);
            $table->dropForeign(['niveau_id']);

            // Drop niveau_id column
            $table->dropColumn('niveau_id');

            // Restore the old unique constraint
            $table->unique(['user_id', 'matiere_id']);

            // Recreate foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('matiere_id')->references('id')->on('matieres')->onDelete('cascade');
        });
    }
};
