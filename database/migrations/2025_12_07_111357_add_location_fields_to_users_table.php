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
        Schema::table('users', function (Blueprint $table) {
            $table->string('pays')->default('GUINEE')->after('email');
            $table->string('region_id')->nullable()->after('pays');
            $table->string('prefecture_id')->nullable()->after('region_id');
            $table->string('commune_id')->nullable()->after('prefecture_id');
            $table->string('quartier_id')->nullable()->after('commune_id');
            $table->text('adresse')->nullable()->after('quartier_id');
            $table->string('telephone')->nullable()->after('adresse');
            $table->text('bio')->nullable()->after('telephone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'pays',
                'region_id',
                'prefecture_id',
                'commune_id',
                'quartier_id',
                'adresse',
                'telephone',
                'bio',
            ]);
        });
    }
};
