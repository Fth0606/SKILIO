<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\SessionRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    private function formatSession($s): array
    {
        $meetingPlaceHistory = $s->meeting_place_history;
        if (is_string($meetingPlaceHistory) && $meetingPlaceHistory !== '') {
            $decoded = json_decode($meetingPlaceHistory, true);
            $meetingPlaceHistory = is_array($decoded) ? $decoded : [];
        }

        return [
            'id' => $s->id,
            'status' => $s->status,
            'scheduled_at' => $s->scheduled_at,
            'requester_id' => $s->requester_id,
            'teacher_id' => $s->teacher_id,
            'requester_confirmed' => (bool) ($s->requester_confirmed ?? false),
            'teacher_confirmed' => (bool) ($s->teacher_confirmed ?? false),
            'requester_rated' => (bool) ($s->requester_rated ?? false),
            'teacher_rated' => (bool) ($s->teacher_rated ?? false),
            'skill' => ['name' => $s->skill_name],
            'teacher' => ['name' => $s->teacher_name],
            'learner' => ['name' => $s->learner_name],
            'meeting_place' => [
                'title' => $s->meeting_place_title,
                'address' => $s->meeting_place_address,
                'map_link' => $s->meeting_place_map_link,
                'room' => $s->meeting_place_room,
                'notes' => $s->meeting_place_notes,
                'status' => $s->meeting_place_status,
                'proposed_by' => $s->meeting_place_proposed_by,
                'change_reason' => $s->meeting_place_change_reason,
                'updated_at' => $s->meeting_place_updated_at,
            ],
            'meeting_place_history' => is_array($meetingPlaceHistory) ? $meetingPlaceHistory : [],
        ];
    }

    private function authUser(Request $request): ?User
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', (string) $token);
        return User::find($userId);
    }

    private function sessionRole(SessionRequest $session, int $userId): ?string
    {
        if ($session->requester_id === $userId) {
            return 'requester';
        }
        if ($session->teacher_id === $userId) {
            return 'teacher';
        }

        return null;
    }

    private function appendMeetingPlaceHistory(SessionRequest $session, array $entry): array
    {
        $history = $session->meeting_place_history;
        if (is_string($history) && $history !== '') {
            $decoded = json_decode($history, true);
            $history = is_array($decoded) ? $decoded : [];
        }
        if (!is_array($history)) {
            $history = [];
        }

        $history[] = $entry;
        return $history;
    }

    private function notifyUser(int $userId, string $type, string $title, string $message, array $data = []): void
    {
        DB::table('notifications')->insert([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => json_encode($data),
            'is_read' => false,
            'created_at' => now(),
        ]);
    }

    public function index(Request $request)
    {
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) return response()->json(['data' => []]);

        $role = $request->input('role', 'both'); // 'learner', 'teacher', or 'both'

        $query = DB::table('session_requests')
            ->join('skills', 'session_requests.skill_id', '=', 'skills.id')
            ->join('users as teacher', 'session_requests.teacher_id', '=', 'teacher.id')
            ->join('users as learner', 'session_requests.requester_id', '=', 'learner.id');

        if ($role === 'learner') {
            $query->where('session_requests.requester_id', $user->id);
        } elseif ($role === 'teacher') {
            $query->where('session_requests.teacher_id', $user->id);
        } else {
            $query->where(function($q) use ($user) {
                $q->where('session_requests.requester_id', $user->id)
                  ->orWhere('session_requests.teacher_id', $user->id);
            });
        }

        $status = $request->input('status', 'upcoming');

        if ($status === 'upcoming') {
            $query->whereIn('session_requests.status', ['accepted', 'pending']);
        } elseif ($status === 'upcoming_and_pending_ratings') {
            $query->whereIn('session_requests.status', ['accepted', 'pending', 'pending_ratings']);
        } elseif ($status === 'cancelled') {
            $query->whereIn('session_requests.status', ['cancelled', 'penalty_applied']);
        } else {
            $query->where('session_requests.status', $status);
        }

        $sessions = $query->select(
            'session_requests.*',
            'skills.name as skill_name',
            'teacher.name as teacher_name',
            'learner.name as learner_name'
        )->paginate(10);

        $sessions->getCollection()->transform(fn ($s) => $this->formatSession($s));

        return response()->json(['data' => $sessions]);
    }

    public function store(Request $request)
    {
        $user = $this->authUser($request);

        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'skill_id' => 'required|exists:skills,id',
        ]);

        // Basic check for credits
        if ($user->credits_balance < 1) {
            return response()->json(['message' => 'Insufficient credits'], 400);
        }

        // Resolve scheduled_at from the chosen slot, or default to 2 days from now
        $scheduledAt = now()->addDays(2);
        if ($request->filled('slot_id')) {
            $slot = \App\Models\UserAvailability::find($request->slot_id);
            if ($slot) {
                $days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
                $scheduledAt = now()->next($days[$slot->day_of_week])->setTimeFromTimeString($slot->start_time);
            }
        }

        // Resolve skill name before creating session
        $skillName = \App\Models\Skill::find($request->skill_id)?->name ?? 'a skill';

        $session = SessionRequest::create([
            'requester_id' => $user->id,
            'teacher_id' => $request->teacher_id,
            'skill_id' => $request->skill_id,
            'status' => 'pending',
            'scheduled_at' => $scheduledAt,
            'notes' => $request->message,
            'credits_held' => 1.00,
        ]);

        DB::transaction(function() use ($user, $session, $skillName) {
            // Deduct credit
            $user->decrement('credits_balance');
            $user->increment('total_credits_spent', $session->credits_held);
            
            // Record transaction
            \App\Models\CreditTransaction::create([
                'user_id' => $user->id,
                'session_request_id' => $session->id,
                'amount' => -$session->credits_held,
                'balance_after' => $user->fresh()->credits_balance,
                'type' => 'spend',
                'description' => "Reserved credit for learning {$skillName}",
            ]);
        });

        return response()->json(['message' => 'Session requested successfully', 'data' => $session]);
    }

    public function accept(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $session->update(['status' => 'accepted']);
        return response()->json(['message' => 'Session accepted']);
    }

    public function reject(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $session->update(['status' => 'rejected']);
        
        // Refund credit
        $learner = User::find($session->requester_id);
        if ($learner) $learner->increment('credits_balance');

        return response()->json(['message' => 'Session rejected']);
    }

    public function complete(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);

        if ($session->requester_id != $userId && $session->teacher_id != $userId) {
            return response()->json(['message' => 'You are not part of this session'], 403);
        }

        if (!in_array($session->status, ['accepted', 'pending_ratings'])) {
            return response()->json(['message' => 'This session cannot be marked as done'], 422);
        }

        if ($session->requester_id == $userId) {
            $session->requester_confirmed = true;
        } else {
            $session->teacher_confirmed = true;
        }

        // Both parties confirmed → ready for ratings (not fully closed yet)
        if ($session->requester_confirmed && $session->teacher_confirmed) {
            $session->status = 'pending_ratings';
        }

        $session->save();

        $message = $session->status === 'pending_ratings'
            ? 'Session complete! Please rate your partner below.'
            : 'Confirmed! Waiting for the other party — you can still leave your rating now.';

        return response()->json(['message' => $message, 'data' => $session->fresh()]);
    }

    public function rate(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $skillName = \App\Models\Skill::find($session->skill_id)?->name ?? 'a skill';
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Allow both the learner and the teacher to rate each other
        if ($user->id != $session->requester_id && $user->id != $session->teacher_id) {
            return response()->json(['message' => 'You are not part of this session'], 403);
        }

        if (!in_array($session->status, ['accepted', 'pending_ratings', 'completed'])) {
            return response()->json(['message' => 'This session cannot be rated yet'], 422);
        }

        $isRequester = $user->id == $session->requester_id;
        $hasConfirmed = $isRequester ? $session->requester_confirmed : $session->teacher_confirmed;
        if (!$hasConfirmed) {
            return response()->json(['message' => 'Mark the session as done before rating'], 422);
        }

        if ($isRequester && $session->requester_rated) {
            return response()->json(['message' => 'You already rated this session'], 422);
        }
        if (!$isRequester && $session->teacher_rated) {
            return response()->json(['message' => 'You already rated this session'], 422);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $ratedId = $isRequester ? $session->teacher_id : $session->requester_id;

        DB::transaction(function () use ($session, $request, $user, $ratedId, $skillName, $isRequester) {
            \App\Models\Rating::create([
                'session_request_id' => $session->id,
                'rater_id' => $user->id,
                'rated_id' => $ratedId,
                'score' => $request->rating,
                'comment' => $request->comment,
            ]);

            if ($isRequester) {
                $session->requester_rated = true;

                $teacher = User::find($session->teacher_id);
                if ($teacher) {
                    $teacher->increment('credits_balance', $session->credits_held);
                    $teacher->increment('total_credits_earned', $session->credits_held);
                    $teacher->increment('total_hours_taught');

                    \App\Models\CreditTransaction::create([
                        'user_id' => $teacher->id,
                        'session_request_id' => $session->id,
                        'amount' => $session->credits_held,
                        'balance_after' => $teacher->fresh()->credits_balance,
                        'type' => 'earn',
                        'description' => "Earned from teaching {$skillName}",
                    ]);
                }
                $user->increment('total_hours_learned');
            } else {
                $session->teacher_rated = true;
            }

            if ($session->requester_rated && $session->teacher_rated) {
                $session->status = 'completed';
            } elseif ($session->requester_confirmed && $session->teacher_confirmed) {
                $session->status = 'pending_ratings';
            }

            $session->save();

            $this->updateRatedUserStats($ratedId, $isRequester ? 'teacher' : 'student');
        });

        return response()->json(['message' => 'Rating submitted successfully']);
    }

    private function updateRatedUserStats(int $ratedId, string $role): void
    {
        $avg = Rating::where('rated_id', $ratedId)->avg('score');
        $rated = User::find($ratedId);
        if (!$rated) {
            return;
        }

        $rounded = round((float) ($avg ?? 0), 2);
        if ($role === 'teacher') {
            $rated->average_rating_as_teacher = $rounded;
        } else {
            $rated->average_rating_as_student = $rounded;
        }
        $rated->save();
    }

    public function cancel(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $skillName = \App\Models\Skill::find($session->skill_id)?->name ?? 'a skill';
        $token = $request->bearerToken();
        $userId = str_replace('mock-token-', '', $token);
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $isRequester = $user->id == $session->requester_id;
        $isTeacher = $user->id == $session->teacher_id;

        if (!$isRequester && !$isTeacher) {
            return response()->json(['message' => 'You are not part of this session'], 403);
        }

        if (!in_array($session->status, ['pending', 'accepted'])) {
            return response()->json(['message' => 'This session cannot be cancelled'], 422);
        }

        $request->validate([
            'cancellation_reason' => 'required|string|max:2000',
        ]);
        $reason = $request->input('cancellation_reason');

        $scheduledAt = Carbon::parse($session->scheduled_at);
        $minutesUntil = now()->diffInMinutes($scheduledAt, false);
        $shortNotice = $minutesUntil < 120; // less than 2 hours before start (or already past)

        $penaltyApplied = false;
        $refunded = false;

        DB::transaction(function () use (
            $session, $skillName, $isRequester, $isTeacher, $shortNotice, $reason, &$penaltyApplied, &$refunded
        ) {
            $learner = User::find($session->requester_id);

            // Late cancellation by student on an accepted session → forfeit held credit
            if ($session->status === 'accepted' && $isRequester && $shortNotice && $learner) {
                $session->update([
                    'status' => 'penalty_applied',
                    'cancelled_by' => 'requester',
                    'cancellation_reason' => $reason,
                    'requester_confirmed' => false,
                    'teacher_confirmed' => false,
                    'requester_rated' => false,
                    'teacher_rated' => false,
                ]);
                $penaltyApplied = true;

                \App\Models\CreditTransaction::create([
                    'user_id' => $learner->id,
                    'session_request_id' => $session->id,
                    'amount' => -$session->credits_held,
                    'balance_after' => $learner->credits_balance,
                    'type' => 'penalty',
                    'description' => "Late cancellation penalty for {$skillName} (less than 2 hours notice)",
                ]);

                return;
            }

            $session->update([
                'status' => 'cancelled',
                'cancelled_by' => $isRequester ? 'requester' : 'teacher',
                'cancellation_reason' => $reason,
                'requester_confirmed' => false,
                'teacher_confirmed' => false,
                'requester_rated' => false,
                'teacher_rated' => false,
            ]);

            if ($learner && $session->credits_held > 0) {
                $learner->increment('credits_balance', $session->credits_held);
                $learner->decrement('total_credits_spent', $session->credits_held);
                $refunded = true;

                \App\Models\CreditTransaction::create([
                    'user_id' => $learner->id,
                    'session_request_id' => $session->id,
                    'amount' => $session->credits_held,
                    'balance_after' => $learner->fresh()->credits_balance,
                    'type' => 'refund',
                    'description' => "Refund for cancelled session on {$skillName}",
                ]);
            }
        });

        $otherUserId = $isRequester ? $session->teacher_id : $session->requester_id;
        $actorName = $user->name ?? ($isRequester ? 'Student' : 'Teacher');
        $this->notifyUser(
            $otherUserId,
            'session_cancelled',
            'Session cancelled',
            "{$actorName} cancelled the session ({$skillName}). Reason: {$reason}",
            ['session_id' => $session->id, 'status' => $penaltyApplied ? 'penalty_applied' : 'cancelled']
        );

        if ($penaltyApplied) {
            return response()->json([
                'message' => 'Session cancelled. Late notice — 1 credit penalty applied (no refund).',
                'penalty_applied' => true,
                'credits_lost' => (float) $session->credits_held,
            ]);
        }

        return response()->json([
            'message' => $refunded
                ? 'Session cancelled. Your credit has been refunded.'
                : 'Session cancelled.',
            'penalty_applied' => false,
            'refunded' => $refunded,
        ]);
    }

    public function history(Request $request)
    {
        $user = $this->authUser($request);

        if (!$user) {
            return response()->json(['data' => []]);
        }

        // Reviews this user received (as teacher or student)
        $ratings = DB::table('ratings')
            ->join('users as rater', 'ratings.rater_id', '=', 'rater.id')
            ->join('session_requests', 'ratings.session_request_id', '=', 'session_requests.id')
            ->join('skills', 'session_requests.skill_id', '=', 'skills.id')
            ->where('ratings.rated_id', $user->id)
            ->select(
                'ratings.id',
                'ratings.score',
                'ratings.comment',
                'ratings.created_at',
                'rater.name as rater_name',
                'skills.name as skill_name'
            )
            ->orderByDesc('ratings.created_at')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'rating' => (int) $r->score,
                'comment' => $r->comment,
                'from' => ['name' => $r->rater_name],
                'session' => ['skill' => ['name' => $r->skill_name]],
                'created_at' => $r->created_at,
            ]);

        return response()->json(['data' => $ratings]);
    }

    public function upsertMeetingPlace(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $user = $this->authUser($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $role = $this->sessionRole($session, $user->id);
        if (!$role) {
            return response()->json(['message' => 'You are not part of this session'], 403);
        }

        if (!in_array($session->status, ['pending', 'accepted', 'pending_ratings'])) {
            return response()->json(['message' => 'Meeting place cannot be changed for this session'], 422);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'map_link' => 'nullable|string|max:500',
            'room' => 'nullable|string|max:120',
            'notes' => 'nullable|string|max:2000',
            'change_reason' => 'nullable|string|max:1000',
        ]);

        $isFirstProposal = empty($session->meeting_place_status);
        if (!$isFirstProposal && empty($validated['change_reason'])) {
            return response()->json(['message' => 'Please provide a reason for changing the meeting place'], 422);
        }

        $newStatus = $isFirstProposal ? 'proposed' : 'changed';
        $entryType = $isFirstProposal ? 'proposed' : 'changed';
        $history = $this->appendMeetingPlaceHistory($session, [
            'type' => $entryType,
            'by_role' => $role,
            'by_user_id' => $user->id,
            'title' => $validated['title'],
            'address' => $validated['address'] ?? null,
            'map_link' => $validated['map_link'] ?? null,
            'room' => $validated['room'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'change_reason' => $validated['change_reason'] ?? null,
            'at' => now()->toDateTimeString(),
        ]);

        $session->update([
            'meeting_place_title' => $validated['title'],
            'meeting_place_address' => $validated['address'] ?? null,
            'meeting_place_map_link' => $validated['map_link'] ?? null,
            'meeting_place_room' => $validated['room'] ?? null,
            'meeting_place_notes' => $validated['notes'] ?? null,
            'meeting_place_status' => $newStatus,
            'meeting_place_proposed_by' => $role,
            'meeting_place_change_reason' => $validated['change_reason'] ?? null,
            'meeting_place_history' => $history,
            'meeting_place_updated_at' => now(),
        ]);

        $otherUserId = $role === 'requester' ? $session->teacher_id : $session->requester_id;
        $actorName = $user->name ?? ($role === 'requester' ? 'Student' : 'Teacher');
        $this->notifyUser(
            $otherUserId,
            'meeting_place',
            'Meeting place updated',
            "{$actorName} {$entryType} the meeting place for your session.",
            ['session_id' => $session->id, 'status' => $newStatus]
        );

        return response()->json([
            'message' => $isFirstProposal ? 'Meeting place proposed successfully' : 'Meeting place updated successfully',
            'data' => $session->fresh(),
        ]);
    }

    public function acceptMeetingPlace(Request $request, $id)
    {
        $session = SessionRequest::findOrFail($id);
        $user = $this->authUser($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $role = $this->sessionRole($session, $user->id);
        if (!$role) {
            return response()->json(['message' => 'You are not part of this session'], 403);
        }

        if (empty($session->meeting_place_status)) {
            return response()->json(['message' => 'No meeting place has been proposed yet'], 422);
        }

        if ($session->meeting_place_status === 'accepted') {
            return response()->json(['message' => 'Meeting place is already accepted', 'data' => $session]);
        }

        $history = $this->appendMeetingPlaceHistory($session, [
            'type' => 'accepted',
            'by_role' => $role,
            'by_user_id' => $user->id,
            'at' => now()->toDateTimeString(),
        ]);

        $session->update([
            'meeting_place_status' => 'accepted',
            'meeting_place_history' => $history,
            'meeting_place_updated_at' => now(),
        ]);

        $otherUserId = $role === 'requester' ? $session->teacher_id : $session->requester_id;
        $actorName = $user->name ?? ($role === 'requester' ? 'Student' : 'Teacher');
        $this->notifyUser(
            $otherUserId,
            'meeting_place',
            'Meeting place accepted',
            "{$actorName} accepted the meeting place details.",
            ['session_id' => $session->id, 'status' => 'accepted']
        );

        return response()->json(['message' => 'Meeting place accepted', 'data' => $session->fresh()]);
    }
}
