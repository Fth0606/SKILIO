<?php

namespace App\Http\Controllers;

use App\Models\CreditTransaction;
use App\Models\User;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['data' => ['data' => [], 'meta' => ['total_earned' => 0, 'total_spent' => 0]]]);
        }

        $transactions = CreditTransaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'data' => [
                'data' => $transactions->items(),
                'meta' => [
                    'total_earned' => (float) $user->total_credits_earned,
                    'total_spent' => (float) $user->total_credits_spent,
                    'current_page' => $transactions->currentPage(),
                    'last_page' => $transactions->lastPage(),
                ]
            ]
        ]);
    }
}
