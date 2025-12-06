<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/teachers', [UserController::class, 'teachers'])->name('teachers');
        Route::get('/parents', [UserController::class, 'parents'])->name('parents');
        Route::get('/students', [UserController::class, 'students'])->name('students');
        Route::get('/teachers/{id}', [UserController::class, 'showTeacher'])->name('teacher.show');
        Route::put('/teachers/{id}/matieres', [UserController::class, 'updateTeacherMatieres'])->name('teacher.matieres.update');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{id}', [UserController::class, 'show'])->name('show');
        Route::put('/{id}', [UserController::class, 'update'])->name('update');
        Route::patch('/{id}', [UserController::class, 'update'])->name('update.patch');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
    });
});

