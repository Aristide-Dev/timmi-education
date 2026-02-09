<?php

use App\Http\Controllers\Teacher\AvailabilityController;
use App\Http\Controllers\Teacher\ProfileController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherRequestController;
use Illuminate\Support\Facades\Route;

// Public routes for searching and viewing teachers
Route::get('/search/teachers', [TeacherController::class, 'search'])->name('teachers.search');
Route::get('/teachers/{id}/public', [TeacherController::class, 'showPublic'])->name('teachers.showPublic');

// Public teacher request routes
Route::get('/teacher-requests', [TeacherRequestController::class, 'create'])->name('teacher-requests.create');
Route::post('/teacher-requests', [TeacherRequestController::class, 'store'])->name('teacher-requests.store');
Route::get('/teacher-requests/thank-you', [TeacherRequestController::class, 'thankYou'])->name('teacher-requests.thank-you');

// Espace professeur connecté (profil + créneaux)
Route::middleware(['auth', 'verified', 'teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('/availability/edit', [AvailabilityController::class, 'edit'])->name('availability.edit');
    Route::put('/availability', [AvailabilityController::class, 'update'])->name('availability.update');
});

