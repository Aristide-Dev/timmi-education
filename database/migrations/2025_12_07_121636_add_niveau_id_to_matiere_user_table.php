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
            // Drop the old unique constraint
            $table->dropUnique(['user_id', 'matiere_id']);
            
            // Add niveau_id column
            $table->foreignId('niveau_id')->nullable()->after('matiere_id')->constrained()->onDelete('cascade');
            
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
            
            // Drop niveau_id column
            $table->dropForeign(['niveau_id']);
            $table->dropColumn('niveau_id');
            
            // Restore the old unique constraint
            $table->unique(['user_id', 'matiere_id']);
        });
    }
};
