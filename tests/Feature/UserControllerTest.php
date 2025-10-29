<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Profile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_index_returns_users_for_admin_user()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'email', 'last_name', 'created_at', 'updated_at']
            ]);
    }

    public function test_index_returns_users_for_manager_user()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $manager->roles()->attach($managerRole);

        Sanctum::actingAs($manager);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'email', 'last_name', 'created_at', 'updated_at']
            ]);
    }

    public function test_index_denies_access_for_regular_user()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $user->roles()->attach($ownerRole);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_index_requires_authentication()
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401);
    }

    public function test_for_register_users_searches_by_name()
    {
        $user = User::factory()->create([
            'name' => 'TestUser',
            'last_name' => 'TestLastName',
            'password' => bcrypt('password123')
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/forregisterusers', [
            'name' => 'Test'
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'TestUser',
                'last_name' => 'TestLastName'
            ]);
    }

    public function test_for_register_users_searches_by_last_name()
    {
        $user = User::factory()->create([
            'name' => 'John',
            'last_name' => 'Johnson',
            'password' => bcrypt('password123')
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/forregisterusers', [
            'name' => 'John'
        ]);

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_for_register_users_validates_required_name()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/forregisterusers', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_for_register_users_validates_minimum_length()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/forregisterusers', [
            'name' => 'ab'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_creates_user_with_admin_role()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        Sanctum::actingAs($admin);

        $userData = [
            'name' => 'NewUser',
            'last_name' => 'NewLastName',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'description' => 'Test description',
            'birth' => '1990-01-01'
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(200)
            ->assertJson(['message' => 'the user has been created']);

        $this->assertDatabaseHas('users', [
            'name' => 'NewUser',
            'email' => 'newuser@example.com'
        ]);

        // Check that profile was NOT automatically created (this is the current behavior)
        $user = User::where('email', 'newuser@example.com')->first();
        $this->assertDatabaseMissing('profiles', [
            'user_id' => $user->id
        ]);
    }

    public function test_store_creates_user_with_manager_role()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $manager->roles()->attach($managerRole);

        Sanctum::actingAs($manager);

        $userData = [
            'name' => 'ManagerUser',
            'last_name' => 'ManagerLastName',
            'email' => 'manageruser@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'name' => 'ManagerUser',
            'email' => 'manageruser@example.com'
        ]);
    }

    public function test_store_denies_access_without_create_permission()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $user->roles()->attach($ownerRole);

        Sanctum::actingAs($user);

        $userData = [
            'name' => 'NewUser',
            'last_name' => 'NewLastName',
            'email' => 'newuser@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(403);
    }

    public function test_store_validates_required_fields()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/users', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'last_name', 'email', 'password']);
    }

    public function test_store_validates_email_format()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/users', [
            'name' => 'TestUser',
            'last_name' => 'TestLast',
            'email' => 'invalid-email',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_store_validates_unique_email()
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com'
        ]);

        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/users', [
            'name' => 'TestUser',
            'last_name' => 'TestLast',
            'email' => 'existing@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_show_returns_user_with_profile_for_admin()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $targetUser->id]);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/users/{$targetUser->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'profile' => ['id', 'user_id', 'description', 'birth']
            ]);
    }

    public function test_show_returns_user_with_profile_for_manager()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $manager->roles()->attach($managerRole);

        $targetUser = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $targetUser->id]);

        Sanctum::actingAs($manager);

        $response = $this->getJson("/api/users/{$targetUser->id}");

        $response->assertStatus(200);
    }

    public function test_show_denies_access_without_view_permission()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $user->roles()->attach($ownerRole);

        $otherUser = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403);
    }

    public function test_show_returns_404_for_nonexistent_user()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/users/99999");

        $response->assertStatus(404);
    }

    public function test_update_updates_user_with_admin_role()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create([
            'name' => 'OldName',
            'email' => 'old@example.com'
        ]);
        $profile = Profile::factory()->create(['user_id' => $targetUser->id]);

        Sanctum::actingAs($admin);

        $updateData = [
            'name' => 'UpdatedName',
            'last_name' => 'UpdatedLastName',
            'email' => 'updated@example.com',
            'description' => 'Updated description',
            'birth' => '1995-05-05'
        ];

        $response = $this->putJson("/api/users/{$targetUser->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson(['message' => "user id:{$targetUser->id}has been updated"]);

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'UpdatedName',
            'email' => 'updated@example.com'
        ]);

        $this->assertDatabaseHas('profiles', [
            'user_id' => $targetUser->id,
            'description' => 'Updated description',
            'birth' => '1995-05-05'
        ]);
    }

    public function test_update_updates_user_with_manager_role()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $manager->roles()->attach($managerRole);

        $targetUser = User::factory()->create([
            'name' => 'OldName'
        ]);

        Sanctum::actingAs($manager);

        $updateData = [
            'name' => 'ManagerUpdatedName',
            'last_name' => 'ManagerUpdatedLastName'
        ];

        $response = $this->putJson("/api/users/{$targetUser->id}", $updateData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'ManagerUpdatedName'
        ]);
    }

    public function test_update_denies_access_without_update_permission()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $user->roles()->attach($ownerRole);

        $otherUser = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/users/{$otherUser->id}", [
            'name' => 'NewName'
        ]);

        $response->assertStatus(403);
    }

    public function test_update_validates_email_uniqueness()
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com'
        ]);

        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create();

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/users/{$targetUser->id}", [
            'email' => 'existing@example.com'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_update_allows_keeping_same_email()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create([
            'email' => 'keep@example.com'
        ]);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/users/{$targetUser->id}", [
            'email' => 'keep@example.com',
            'name' => 'UpdatedName'
        ]);

        $response->assertStatus(200);
    }

    public function test_destroy_deletes_user_and_profile_with_admin_role()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $admin->roles()->attach($adminRole);

        $targetUser = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $targetUser->id]);

        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/users/{$targetUser->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => "user id:{$targetUser->id}has been deleted"]);

        $this->assertSoftDeleted('users', [
            'id' => $targetUser->id
        ]);

        $this->assertSoftDeleted('profiles', [
            'id' => $profile->id
        ]);
    }

    public function test_destroy_deletes_user_with_manager_role()
    {
        $managerRole = Role::where('name', 'admin_manager')->first();
        $manager = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $manager->roles()->attach($managerRole);

        $targetUser = User::factory()->create();
        $profile = Profile::factory()->create(['user_id' => $targetUser->id]);

        Sanctum::actingAs($manager);

        $response = $this->deleteJson("/api/users/{$targetUser->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('users', [
            'id' => $targetUser->id
        ]);
    }

    public function test_destroy_denies_access_without_delete_permission()
    {
        $ownerRole = Role::where('name', 'profile_owner')->first();
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);
        $user->roles()->attach($ownerRole);

        $otherUser = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403);
    }
}