<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/analytics', [App\Http\Controllers\AdminController::class, 'analytics']);
    Route::get('/settings', function () {
        return response()->json(['data' => ['institution_name' => 'Harvard University', 'primary_color' => '#0F6E56']]);
    });
    Route::put('/settings', [App\Http\Controllers\AdminController::class, 'updateSettings']);
    Route::get('/users', [App\Http\Controllers\AdminController::class, 'users']);
    Route::post('/users/{id}/activate', [App\Http\Controllers\AdminController::class, 'updateUserStatus']);
    Route::post('/users/{id}/deactivate', [App\Http\Controllers\AdminController::class, 'updateUserStatus']);
    Route::get('/billing', function () {
        return response()->json(['data' => [
            'current_plan' => 'Academy',
            'next_invoice' => '2026-06-01',
            'amount' => 99,
            'payment_method' => '•••• 4242'
        ]]);
    });
    Route::get('/skills', function () {
        return response()->json(['data' => ['data' => [], 'last_page' => 1]]);
    });
});

// Super Admin Routes
Route::prefix('super-admin')->group(function () {
    Route::get('/analytics', function () {
        return response()->json(['data' => [
            'total_tenants' => 47,
            'total_users' => 28431,
            'total_sessions' => 124567,
            'mrr' => 51200,
            'churn_rate' => 4.2
        ]]);
    });
    Route::get('/tenants', function () {
        return response()->json(['data' => ['data' => [], 'last_page' => 1]]);
    });
    Route::get('/plans', function () {
        return response()->json(['data' => []]);
    });
    Route::get('/revenue', function () {
        return response()->json(['data' => ['mrr_chart' => [], 'sessions_chart' => [], 'forecast' => []]]);
    });
});

// Student/Teacher Routes
Route::get('/skills', [App\Http\Controllers\SkillController::class, 'index']);
Route::post('/skills', [App\Http\Controllers\SkillController::class, 'store']);
Route::get('/skills/categories', [App\Http\Controllers\SkillController::class, 'categories']);
Route::get('/teachers/me/skills', [App\Http\Controllers\SkillController::class, 'userSkills']);
Route::delete('/skills/{id}', [App\Http\Controllers\SkillController::class, 'destroy']);
Route::get('/teachers', [App\Http\Controllers\SkillController::class, 'teachers']);
Route::get('/sessions/history', [App\Http\Controllers\SessionController::class, 'history']);
Route::get('/teachers/me', [AuthController::class, 'me']);
Route::post('/teachers/availability', [App\Http\Controllers\SkillController::class, 'setAvailability']);
Route::get('/sessions', [App\Http\Controllers\SessionController::class, 'index']);
Route::post('/sessions', [App\Http\Controllers\SessionController::class, 'store']);
Route::post('/sessions/{id}/accept', [App\Http\Controllers\SessionController::class, 'accept']);
Route::post('/sessions/{id}/reject', [App\Http\Controllers\SessionController::class, 'reject']);
Route::post('/sessions/{id}/rate', [App\Http\Controllers\SessionController::class, 'rate']);
Route::post('/sessions/{id}/complete', [App\Http\Controllers\SessionController::class, 'complete']);
Route::post('/sessions/{id}/cancel', [App\Http\Controllers\SessionController::class, 'cancel']);
Route::post('/sessions/{id}/meeting-place', [App\Http\Controllers\SessionController::class, 'upsertMeetingPlace']);
Route::post('/sessions/{id}/meeting-place/accept', [App\Http\Controllers\SessionController::class, 'acceptMeetingPlace']);
Route::get('/credits/balance', function (Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', $token);
    $user = App\Models\User::find($userId);
    return response()->json(['data' => ['balance' => $user ? (float) $user->credits : 0]]);
});
Route::get('/credits/transactions', [App\Http\Controllers\TransactionController::class, 'index']);
Route::get('/notifications', function (Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', (string) $token);
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['data' => []]);
    }

    $notifications = DB::table('notifications')
        ->where('user_id', $user->id)
        ->orderByDesc('created_at')
        ->limit(30)
        ->get()
        ->map(function ($n) {
            $payload = $n->data;
            if (is_string($payload) && $payload !== '') {
                $decoded = json_decode($payload, true);
                $payload = is_array($decoded) ? $decoded : [];
            }

            return [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'data' => is_array($payload) ? $payload : [],
                'is_read' => (bool) $n->is_read,
                'created_at' => $n->created_at,
            ];
        });

    return response()->json(['data' => $notifications]);
});

Route::post('/notifications/{id}/read', function (Illuminate\Http\Request $request, $id) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', (string) $token);
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    DB::table('notifications')
        ->where('id', $id)
        ->where('user_id', $user->id)
        ->update(['is_read' => true, 'read_at' => now()]);

    return response()->json(['message' => 'Notification marked as read']);
});

Route::post('/notifications/read-all', function (Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', (string) $token);
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    DB::table('notifications')
        ->where('user_id', $user->id)
        ->where('is_read', false)
        ->update(['is_read' => true, 'read_at' => now()]);

    return response()->json(['message' => 'Notifications marked as read']);
});

Route::post('/notifications/meeting-place/read', function (Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', (string) $token);
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    DB::table('notifications')
        ->where('user_id', $user->id)
        ->where('type', 'meeting_place')
        ->where('is_read', false)
        ->update(['is_read' => true, 'read_at' => now()]);

    return response()->json(['message' => 'Meeting place notifications marked as read']);
});
