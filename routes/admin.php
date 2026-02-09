<?php

use App\Http\Controllers\Admin\MatiereController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TeacherAvailabilityController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\TeacherRequestController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Users management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/parents', [UserController::class, 'parents'])->name('parents');
        Route::get('/students', [UserController::class, 'students'])->name('students');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{id}', [UserController::class, 'show'])->name('show');
        Route::put('/{id}', [UserController::class, 'update'])->name('update');
        Route::patch('/{id}', [UserController::class, 'update'])->name('update.patch');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Roles management
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{id}', [RoleController::class, 'show'])->name('show');
        Route::put('/{id}', [RoleController::class, 'update'])->name('update');
        Route::patch('/{id}', [RoleController::class, 'update'])->name('update.patch');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->name('destroy');
        Route::post('/{id}/activate', [RoleController::class, 'activate'])->name('activate');
        Route::post('/{id}/deactivate', [RoleController::class, 'deactivate'])->name('deactivate');
    });

    // Matieres management
    Route::prefix('matieres')->name('matieres.')->group(function () {
        Route::get('/', [MatiereController::class, 'index'])->name('index');
        Route::post('/', [MatiereController::class, 'store'])->name('store');
        Route::get('/{id}', [MatiereController::class, 'show'])->name('show');
        Route::put('/{id}', [MatiereController::class, 'update'])->name('update');
        Route::patch('/{id}', [MatiereController::class, 'update'])->name('update.patch');
        Route::delete('/{id}', [MatiereController::class, 'destroy'])->name('destroy');
    });

    // Teachers management
    Route::prefix('teachers')->name('teachers.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->name('index');
        Route::get('/create', [TeacherController::class, 'create'])->name('create');
        Route::post('/', [TeacherController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TeacherController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TeacherController::class, 'update'])->name('update');
        Route::patch('/{id}', [TeacherController::class, 'update'])->name('update.patch');
        Route::get('/{id}', [TeacherController::class, 'show'])->name('show');
        Route::get('/{id}/availability/edit', [TeacherAvailabilityController::class, 'edit'])->name('availability.edit');
        Route::put('/{id}/availability', [TeacherAvailabilityController::class, 'update'])->name('availability.update');
        Route::put('/{id}/matieres', [TeacherController::class, 'updateMatieres'])->name('matieres.update');
        Route::delete('/{id}', [TeacherController::class, 'destroy'])->name('destroy');
    });

    // Teacher requests management
    Route::prefix('teacher-requests')->name('teacher-requests.')->group(function () {
        Route::get('/', [TeacherRequestController::class, 'index'])->name('index');
        Route::get('/{id}', [TeacherRequestController::class, 'show'])->name('show');
        Route::patch('/{id}/status', [TeacherRequestController::class, 'updateStatus'])->name('updateStatus');
        Route::patch('/{id}/assign', [TeacherRequestController::class, 'assign'])->name('assign');
    });
});
