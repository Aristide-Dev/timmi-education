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
        Schema::table('teacher_requests', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Generate UUIDs for existing records
        $requests = \App\Models\TeacherRequest::whereNull('uuid')->get();
        foreach ($requests as $request) {
            $request->uuid = \Illuminate\Support\Str::uuid()->toString();
            $request->save();
        }

        // Make uuid NOT NULL after populating
        Schema::table('teacher_requests', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teacher_requests', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
