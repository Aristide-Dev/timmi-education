<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\Niveau;
use App\Services\MatiereService;
use App\Http\Controllers\DashboardController;

Route::get('/', function (MatiereService $matiereService) {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'matieres' => $matiereService->getActiveMatieres(),
        'niveaux' => Niveau::where('is_active', true)->orderBy('ordre')->get(),
    ]);
})->name('home');

Route::get('/register', function () {
    return redirect()->route('login');
})->name('register');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/teachers.php';
