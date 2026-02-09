<?php

namespace App\Services;

use App\Models\Role;
use App\Models\TeacherRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class TeacherRequestAssignmentService
{
    public function __construct(
        protected UserService $userService
    ) {
    }

    /**
     * Assign a teacher to the request and optionally create requester account (student or teacher).
     */
    public function assign(
        TeacherRequest $teacherRequest,
        ?int $assignedTeacherId,
        ?Carbon $scheduledAt = null,
        bool $createRequesterAccount = false,
        ?string $requesterRole = null
    ): void {
        $teacherRequest->update([
            'assigned_teacher_id' => $assignedTeacherId,
            'scheduled_at' => $scheduledAt,
        ]);

        if ($createRequesterAccount && $requesterRole && in_array($requesterRole, ['student', 'teacher'], true)) {
            $this->createRequesterAccountIfRequested($teacherRequest, true, $requesterRole);
        }
    }

    /**
     * Create or link requester user and send password reset link.
     */
    public function createRequesterAccountIfRequested(
        TeacherRequest $teacherRequest,
        bool $createAccount,
        string $role
    ): ?User {
        if (! $createAccount || ! in_array($role, ['student', 'teacher'], true)) {
            return null;
        }

        $existingUser = User::where('email', $teacherRequest->email)->first();

        if ($existingUser) {
            $teacherRequest->update(['requester_user_id' => $existingUser->id]);
            Password::sendResetLink(['email' => $existingUser->email]);

            return $existingUser;
        }

        $roleModel = Role::where('slug', $role)->first();
        if (! $roleModel) {
            return null;
        }

        $user = $this->userService->createUser([
            'name' => $teacherRequest->name,
            'email' => $teacherRequest->email,
            'password' => Hash::make(Str::random(32)),
            'roles' => [$roleModel->id],
        ]);

        if ($teacherRequest->phone) {
            $user->update(['telephone' => $teacherRequest->phone]);
        }

        $teacherRequest->update(['requester_user_id' => $user->id]);
        Password::sendResetLink(['email' => $user->email]);

        return $user;
    }
}
