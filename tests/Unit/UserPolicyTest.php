<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected UserPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->policy = new UserPolicy();
    }

    public function test_admin_can_view_any()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $result = $this->policy->viewAny($admin);

        $this->assertTrue($result);
    }

    public function test_manager_can_view_any()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create();
        $manager->roles()->attach($managerRole);

        $result = $this->policy->viewAny($manager);

        $this->assertTrue($result);
    }

    public function test_regular_user_cannot_view_any()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create();
        $user->roles()->attach($ownerRole);

        $result = $this->policy->viewAny($user);

        $this->assertFalse($result);
    }

    public function test_admin_can_view_user()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->view($admin, $targetUser);

        $this->assertTrue($result);
    }

    public function test_manager_can_view_user()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create();
        $manager->roles()->attach($managerRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->view($manager, $targetUser);

        $this->assertTrue($result);
    }

    public function test_user_without_permission_cannot_view_other_user()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create();
        $user->roles()->attach($ownerRole);

        $otherUser = User::factory()->create();

        $result = $this->policy->view($user, $otherUser);

        $this->assertFalse($result);
    }

    public function test_admin_can_create_user()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $result = $this->policy->create($admin);

        $this->assertTrue($result);
    }

    public function test_manager_can_create_user()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create();
        $manager->roles()->attach($managerRole);

        $result = $this->policy->create($manager);

        $this->assertTrue($result);
    }

    public function test_regular_user_cannot_create_user()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create();
        $user->roles()->attach($ownerRole);

        $result = $this->policy->create($user);

        $this->assertFalse($result);
    }

    public function test_admin_can_update_user()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->update($admin, $targetUser);

        $this->assertTrue($result);
    }

    public function test_manager_can_update_user()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create();
        $manager->roles()->attach($managerRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->update($manager, $targetUser);

        $this->assertTrue($result);
    }

    public function test_regular_user_cannot_update_other_user()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create();
        $user->roles()->attach($ownerRole);

        $otherUser = User::factory()->create();

        $result = $this->policy->update($user, $otherUser);

        $this->assertFalse($result);
    }

    public function test_admin_can_delete_user()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create();
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->delete($admin, $targetUser);

        $this->assertTrue($result);
    }

    public function test_manager_can_delete_user()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create();
        $manager->roles()->attach($managerRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->delete($manager, $targetUser);

        $this->assertTrue($result);
    }

    public function test_regular_user_cannot_delete_other_user()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create();
        $user->roles()->attach($ownerRole);

        $otherUser = User::factory()->create();

        $result = $this->policy->delete($user, $otherUser);

        $this->assertFalse($result);
    }

    public function test_view_admin_role_cannot_view_any()
    {
        $viewAdminRole = Role::where('name', 'view_admin')->first();
        $viewAdmin = User::factory()->create();
        $viewAdmin->roles()->attach($viewAdminRole);

        $result = $this->policy->viewAny($viewAdmin);

        $this->assertFalse($result);
    }

    public function test_view_admin_role_cannot_create_user()
    {
        $viewAdminRole = Role::where('name', 'view_admin')->first();
        $viewAdmin = User::factory()->create();
        $viewAdmin->roles()->attach($viewAdminRole);

        $result = $this->policy->create($viewAdmin);

        $this->assertFalse($result);
    }

    public function test_view_admin_role_cannot_update_user()
    {
        $viewAdminRole = Role::where('name', 'view_admin')->first();
        $viewAdmin = User::factory()->create();
        $viewAdmin->roles()->attach($viewAdminRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->update($viewAdmin, $targetUser);

        $this->assertFalse($result);
    }

    public function test_view_admin_role_cannot_delete_user()
    {
        $viewAdminRole = Role::where('name', 'view_admin')->first();
        $viewAdmin = User::factory()->create();
        $viewAdmin->roles()->attach($viewAdminRole);

        $targetUser = User::factory()->create();

        $result = $this->policy->delete($viewAdmin, $targetUser);

        $this->assertFalse($result);
    }
}