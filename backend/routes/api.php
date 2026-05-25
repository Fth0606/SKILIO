<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/analytics', [App\Http\Controllers\AdminController::class, 'analytics']);
    Route::get('/analytics/export', [App\Http\Controllers\AdminController::class, 'exportReport']);
    Route::get('/settings', [App\Http\Controllers\AdminController::class, 'getSettings']);
    Route::put('/settings', [App\Http\Controllers\AdminController::class, 'updateSettings']);
    Route::post('/settings/logo', [App\Http\Controllers\AdminController::class, 'uploadLogo']);
    Route::get('/users', [App\Http\Controllers\AdminController::class, 'users']);
    Route::post('/users/invite', [App\Http\Controllers\AdminController::class, 'inviteUser']);
    Route::post('/users/import', [App\Http\Controllers\AdminController::class, 'bulkImport']);
    Route::post('/users/{id}/activate', [App\Http\Controllers\AdminController::class, 'updateUserStatus']);
    Route::post('/users/{id}/suspend', [App\Http\Controllers\AdminController::class, 'updateUserStatus']);
    Route::get('/billing', [App\Http\Controllers\AdminController::class, 'billing']);
    Route::post('/billing/upgrade', [App\Http\Controllers\AdminController::class, 'upgradePlan']);
    Route::get('/skills', [App\Http\Controllers\AdminController::class, 'skillsManagement']);
    Route::post('/skills/{id}/approve', [App\Http\Controllers\AdminController::class, 'approveSkill']);
    Route::post('/skills/{id}/hide', [App\Http\Controllers\AdminController::class, 'hideSkill']);
});

// Super Admin Routes
Route::prefix('super-admin')->group(function () {
    Route::get('/analytics', [App\Http\Controllers\SuperAdminController::class, 'analytics']);
    Route::get('/tenants', [App\Http\Controllers\SuperAdminController::class, 'tenants']);
    Route::get('/tenants/{id}', [App\Http\Controllers\SuperAdminController::class, 'getTenant']);
    Route::post('/tenants', [App\Http\Controllers\SuperAdminController::class, 'createTenant']);
    Route::put('/tenants/{id}', [App\Http\Controllers\SuperAdminController::class, 'updateTenant']);
    Route::post('/tenants/{id}/suspend', [App\Http\Controllers\SuperAdminController::class, 'suspendTenant']);
    Route::post('/tenants/{id}/activate', [App\Http\Controllers\SuperAdminController::class, 'activateTenant']);
    Route::delete('/tenants/{id}', [App\Http\Controllers\SuperAdminController::class, 'deleteTenant']);
    Route::get('/tenants/{id}/stats', [App\Http\Controllers\SuperAdminController::class, 'tenantStats']);
    Route::get('/plans', [App\Http\Controllers\SuperAdminController::class, 'plans']);
    Route::post('/plans', [App\Http\Controllers\SuperAdminController::class, 'createPlan']);
    Route::put('/plans/{id}', [App\Http\Controllers\SuperAdminController::class, 'updatePlan']);
    Route::post('/plans/{id}/publish', [App\Http\Controllers\SuperAdminController::class, 'publishPlan']);
    Route::get('/revenue', [App\Http\Controllers\SuperAdminController::class, 'revenue']);
    Route::get('/tickets', [App\Http\Controllers\SuperAdminController::class, 'tickets']);
    Route::post('/tickets/{id}/resolve', [App\Http\Controllers\SuperAdminController::class, 'resolveTicket']);
    Route::post('/tickets/{id}/assign', [App\Http\Controllers\SuperAdminController::class, 'assignTicket']);
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
        return response()->json(['message' => 'Non autorisé'], 401);
    }

    DB::table('notifications')
        ->where('id', $id)
        ->where('user_id', $user->id)
        ->update(['is_read' => true, 'read_at' => now()]);

    return response()->json(['message' => 'Notification marquée comme lue']);
});

Route::post('/notifications/read-all', function (Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', (string) $token);
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Non autorisé'], 401);
    }

    DB::table('notifications')
        ->where('user_id', $user->id)
        ->where('is_read', false)
        ->update(['is_read' => true, 'read_at' => now()]);

    return response()->json(['message' => 'Notifications marquées comme lues']);
});

Route::post('/notifications/meeting-place/read', function (Illuminate\Http\Request $request) {
    $token = $request->bearerToken();
    $userId = str_replace('mock-token-', '', (string) $token);
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'Non autorisé'], 401);
    }

    DB::table('notifications')
        ->where('user_id', $user->id)
        ->where('type', 'meeting_place')
        ->where('is_read', false)
        ->update(['is_read' => true, 'read_at' => now()]);

    return response()->json(['message' => 'Notifications de lieu de rencontre marquées comme lues']);
});
