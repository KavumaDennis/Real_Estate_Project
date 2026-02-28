<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('role');
    });
    
    Route::get('/properties/mine', [\App\Http\Controllers\Api\PropertyController::class, 'myProperties']);
    Route::post('/properties', [\App\Http\Controllers\Api\PropertyController::class, 'store']);
    Route::post('/properties/{id}', [\App\Http\Controllers\Api\PropertyController::class, 'update']); // POST with _method=PUT for FormData
    Route::delete('/properties/{id}', [\App\Http\Controllers\Api\PropertyController::class, 'destroy']);
    Route::post('/agents/{id}/contact', [\App\Http\Controllers\Api\AgentController::class, 'contact']);

    // Inquiry/Leads management
    Route::get('/inquiries', [\App\Http\Controllers\Api\InquiryController::class, 'index']);
    Route::patch('/inquiries/{id}', [\App\Http\Controllers\Api\InquiryController::class, 'update']);
    Route::delete('/inquiries/{id}', [\App\Http\Controllers\Api\InquiryController::class, 'destroy']);

    // Review management
    Route::get('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'index']);
    Route::post('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
    Route::post('/reviews/{id}/toggle-approval', [\App\Http\Controllers\Api\ReviewController::class, 'toggleApproval']);
    Route::delete('/reviews/{id}', [\App\Http\Controllers\Api\ReviewController::class, 'destroy']);

    // Profile routes
    Route::post('/profile', [App\Http\Controllers\Api\ProfileController::class, 'update']);
    Route::post('/profile/password', [App\Http\Controllers\Api\ProfileController::class, 'updatePassword']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
        Route::get('/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'index']);
        Route::post('/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'store']);
        Route::get('/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'show']);
        Route::post('/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'update']);
        Route::delete('/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'destroy']);
        Route::get('/roles', [\App\Http\Controllers\Api\Admin\UserController::class, 'roles']);

        Route::get('/settings', [\App\Http\Controllers\Api\Admin\SettingController::class, 'index']);
        Route::post('/settings/bulk', [\App\Http\Controllers\Api\Admin\SettingController::class, 'updateBulk']);
        Route::post('/settings', [\App\Http\Controllers\Api\Admin\SettingController::class, 'store']);

        Route::get('/transactions', [\App\Http\Controllers\Api\Admin\TransactionController::class, 'index']);
        Route::get('/transactions/{id}', [\App\Http\Controllers\Api\Admin\TransactionController::class, 'show']);

        Route::get('/pages', [\App\Http\Controllers\Api\Admin\PageController::class, 'index']);
        Route::post('/pages', [\App\Http\Controllers\Api\Admin\PageController::class, 'store']);
        Route::get('/pages/{id}', [\App\Http\Controllers\Api\Admin\PageController::class, 'show']);
        Route::post('/pages/{id}', [\App\Http\Controllers\Api\Admin\PageController::class, 'update']);
        Route::delete('/pages/{id}', [\App\Http\Controllers\Api\Admin\PageController::class, 'destroy']);

        // New Admin Routes
        Route::apiResource('categories', \App\Http\Controllers\Api\Admin\CategoryController::class);
        Route::apiResource('locations', \App\Http\Controllers\Api\Admin\LocationController::class);
        Route::apiResource('amenities', \App\Http\Controllers\Api\Admin\AmenityController::class);
        
        // Analytics
        Route::get('/analytics', [\App\Http\Controllers\Api\Admin\AnalyticsController::class, 'index']);

        // Post Admin routes (existing)
        Route::get('/posts', [\App\Http\Controllers\Api\PostController::class, 'adminIndex']);
        Route::post('/posts', [\App\Http\Controllers\Api\PostController::class, 'store']);
        Route::post('/posts/{id}', [\App\Http\Controllers\Api\PostController::class, 'update']);
        Route::delete('/posts/{id}', [\App\Http\Controllers\Api\PostController::class, 'destroy']);
    });
});

Route::get('/properties', [App\Http\Controllers\Api\PropertyController::class, 'index']);
Route::get('/properties/featured', [App\Http\Controllers\Api\PropertyController::class, 'featured']);
Route::get('/properties/{slug}', [App\Http\Controllers\Api\PropertyController::class, 'show']);

Route::get('/posts', [App\Http\Controllers\Api\PostController::class, 'index']);
Route::get('/posts/{slug}', [App\Http\Controllers\Api\PostController::class, 'show']);
Route::get('/post-categories', [App\Http\Controllers\Api\PostCategoryController::class, 'index']);
Route::get('/locations', [App\Http\Controllers\Api\LocationController::class, 'index']);

Route::get('/agents', [App\Http\Controllers\Api\AgentController::class, 'index']);
Route::get('/agents/{id}', [App\Http\Controllers\Api\AgentController::class, 'show']);

Route::post('/inquiries', [\App\Http\Controllers\Api\InquiryController::class, 'store']);
