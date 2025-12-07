<?php

use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

// Public routes for searching and viewing teachers
Route::get('/search/teachers', [TeacherController::class, 'search'])->name('teachers.search');
Route::get('/teachers/{id}/public', [TeacherController::class, 'showPublic'])->name('teachers.showPublic');

// Teacher request routes
Route::get('/teacher-requests', [App\Http\Controllers\TeacherRequestController::class, 'create'])->name('teacher-requests.create');
Route::post('/teacher-requests', [App\Http\Controllers\TeacherRequestController::class, 'store'])->name('teacher-requests.store');
Route::get('/teacher-requests/thank-you', [App\Http\Controllers\TeacherRequestController::class, 'thankYou'])->name('teacher-requests.thank-you');

Route::middleware('auth')->group(function () {
    Route::prefix('teachers')->name('teachers.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->name('index');
        Route::get('/create', [TeacherController::class, 'create'])->name('create');
        Route::post('/', [TeacherController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TeacherController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TeacherController::class, 'update'])->name('update');
        Route::patch('/{id}', [TeacherController::class, 'update'])->name('update.patch');
        Route::get('/{id}', [TeacherController::class, 'show'])->name('show');
        Route::put('/{id}/matieres', [TeacherController::class, 'updateMatieres'])->name('matieres.update');
        Route::delete('/{id}', [TeacherController::class, 'destroy'])->name('destroy');
    });

    // Teacher requests management routes
    Route::prefix('admin/teacher-requests')->name('admin.teacher-requests.')->group(function () {
        Route::get('/', [App\Http\Controllers\TeacherRequestController::class, 'index'])->name('index');
        Route::get('/{id}', [App\Http\Controllers\TeacherRequestController::class, 'show'])->name('show');
        Route::patch('/{id}/status', [App\Http\Controllers\TeacherRequestController::class, 'updateStatus'])->name('updateStatus');
    });
});

