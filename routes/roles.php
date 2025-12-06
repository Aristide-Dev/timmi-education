<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
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
});

