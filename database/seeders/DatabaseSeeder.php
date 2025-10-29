<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user_admin = User::factory()->create([
            'name' => 'Admin',
            'last_name' => 'Lna',
            'email' => 'admin@example.com',
            'password' => '123'
        ]);

        $user_manag_admin = User::factory()->create([
            'name' => 'manager',
            'last_name' => 'manag',
            'email' => 'manager@example.com',
            'password' => '123'
        ]);

        $user_child = User::factory()->create([
            'name' => 'Namechildren',
            'last_name' => 'Lastnamechilren',
            'email' => 'us1@example.com',
            'password' => '123'
        ]);

        $user_coowner = User::factory()->create([
            'name' => 'Nameparrent',
            'last_name' => 'Lastnameparrent',
            'email' => 'us2@example.com',
            'password' => '123',
            'parent_user_id' => $user_child->id
        ]);

        $user_child2 = User::factory()->create([
            'name' => 'Nameus3',
            'last_name' => 'Lastnameus3',
            'email' => 'us3@example.com',
            'password' => '123'
        ]);

        $user_child3 = User::factory()->create([
            'name' => 'Namechildren4',
            'last_name' => 'Lastnameus4',
            'email' => 'us4@example.com',
            'password' => '123'
        ]);

        Profile::factory()->create([
            'user_id' => $user_child->id
        ]);

        Profile::factory()->create([
            'user_id' => $user_child2->id
        ]);

        Profile::factory()->create([
            'user_id' => $user_child3->id,
            'description' => null
        ]);

        $role_admin = Role::factory()->create([
            'name' => 'admin',
            'permissions' => []
        ]);

        $role_view_admin = Role::factory()->create([
            'name' => 'view_admin',
            'permissions' => []
        ]);

        $role_manager = Role::factory()->create([
            'name' => 'admin_manager',
            'permissions' => [
                "Profile" => ["viewAny" => ["permitEntity"], "view" => ["permitEntity"], "create" => ["permitEntity"], "update" => ["permitEntity"]],
                "User" => ["viewAny" => ["permitEntity"], "view" => ["permitEntity"], "create" => ["permitEntity"], "update" => ["permitEntity"], "delete" => ["permitEntity"]]
            ]
        ]);

        $role_profile_owner = Role::factory()->create();

        $role_profile_coowner = Role::factory()->create([
            'name' => 'profile_coowner',
            'permissions' => ["Profile" => ["viewAny" => ["permitEntity"], "view" => ["сoOwner"], "update" => ["сoOwner"]]]
        ]);

        Role::factory()->create([
            'name' => 'profile_coowner_not_confirmed',
            'permissions' => ["Profile" => ["viewAny" => ["permitEntity"]]]
        ]);

        DB::table('role_user')
        ->insert([
            [
                'role_id' => $role_admin->id,
                'user_id' => $user_admin->id
            ],
            [
                'role_id' => $role_manager->id,
                'user_id' => $user_manag_admin->id
            ],
            [
                'role_id' => $role_view_admin->id,
                'user_id' => $user_manag_admin->id
            ],
            [
                'role_id' => $role_profile_owner->id,
                'user_id' => $user_child->id
            ],
            [
                'role_id' => $role_profile_coowner->id,
                'user_id' => $user_coowner->id
            ],
            [
                'role_id' => $role_profile_owner->id,
                'user_id' => $user_child2->id
            ]
        ]);
    }
}
