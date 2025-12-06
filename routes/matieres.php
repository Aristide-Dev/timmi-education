<?php

use App\Http\Controllers\MatiereController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('matieres')->name('matieres.')->group(function () {
        Route::get('/', [MatiereController::class, 'index'])->name('index');
        Route::post('/', [MatiereController::class, 'store'])->name('store');
        Route::get('/{id}', [MatiereController::class, 'show'])->name('show');
        Route::put('/{id}', [MatiereController::class, 'update'])->name('update');
        Route::patch('/{id}', [MatiereController::class, 'update'])->name('update.patch');
        Route::delete('/{id}', [MatiereController::class, 'destroy'])->name('destroy');
    });
});

