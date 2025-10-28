<?php

namespace App\Policies;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Role;

/**
 * @param User $user
 * @param string $permit permit name (viewAny|view|create|update|delete|restore|forceDelete|...)
 * @param Model|string $model name or the object model which requires verification
 */
trait Policy {

    protected function getPermissions(User $user, string $permit, Model|string $model) {

        $name_model = is_object($model) ? class_basename($model) : $model;
        $name_model_ar = explode('\\', $name_model);
        $name_model = end($name_model_ar);

        $roles = $user->roles;
        $result = [];

        $dbu = [];

        foreach($roles->toArray() as $role) {

            if($role['name'] === 'admin') {
                $result[] = ['admin'];
                break;
            }
            $permissions = $role['permissions'];
            $dbu[] = $permissions;

            foreach($permissions as $role_model_name => $func_names) {

                if($role_model_name === $name_model) {
                    
                    foreach($func_names as $func_name => $allows) {

                        if($func_name === $permit) {
                            
                            if(is_array($allows)) {
                                $result[] = $allows;
                            }
                            break 2;
                        }
                    }
                }
            }
        }
 
        return $result;
    }

    protected function permitNotRole($user, $model, string $allow) {
        
        $roles_not = str_replace('permitNotRole|', '', $allow);
        $roles_not_ar = explode('|', $roles_not);
        // TODO: логика проверки созданна ли $model юзером у которого есть роль из $roles_not_ar
        return false; //заглушка
    }

    protected function basePolicy(User $user, array $role_allows, Model $model) {

        foreach($role_allows as $allows) {

            foreach($allows as $allow) {

                if($allow === 'admin') {
                    return true;
                }

                if(strripos($allow, 'permitNotRole|') !== false) {

                    if($this->permitNotRole($user, $model, $allow)) return false;
                }
                
                if($allow === 'permitEntity') {
                    return true;
                }

                if($allow === 'owner') {
                    $owner = $model->user;
                    $ow_id = $owner?->id ? $owner->id : false;
                    $us_id = $user->id;

                    if($ow_id === $us_id) {
                        return true;
                    }
                }

                if($allow === 'permitRole|') {
                    $roles = str_replace('permitNotRole|', '', $allow);
                    $roles_ar = explode('|', $roles);
                    // TODO: логика проверки созданна ли $model юзером у которого есть роль из $roles_ar
                    return false; //заглушка
                }
            }
        }
        return false;
    }

    public function viewAdmin(User $user): bool
    {
        $roles = $user->roles;
        $result = false;

        foreach($roles->toArray() as $role) {

            if($role['name'] === 'view_admin') {
                $result = true;
                break;
            }
        }
        return $result;
    }

    public function viewAny(User $user): bool
    {
        $base_name = class_basename($this);
        $model_name = str_replace('Policy', '', $base_name);
        $permissions = $this->getPermissions($user, 'viewAny', $model_name);

        if($permissions) {
            return true;
        } else {
            return false;
        }
    }

    public function view(User $user, Model $model): bool
    {
        $permissions = $this->getPermissions($user, 'view', $model);
        return $this->basePolicy($user, $permissions, $model);
    }

    public function create(User $user): bool
    {
        $base_name = class_basename($this);
        $model_name = str_replace('Policy', '', $base_name);
        $permissions = $this->getPermissions($user, 'create', $model_name);

        if($permissions) {
            return true;
        } else {
            return false;
        }
    }

    public function update(User $user, Model $model): bool
    {
        $permissions = $this->getPermissions($user, 'update', $model);
        return $this->basePolicy($user, $permissions, $model);
    }

     public function delete(User $user, User $model): bool
    {
        $permissions = $this->getPermissions($user, 'delete', $model);
        return $this->basePolicy($user, $permissions, $model);
    }

    // TODO: пока только для admin
    public function restore(User $user, Model $model): bool
    {
        $permissions = $this->getPermissions($user, 'restore', $model);

        if(in_array('admin', $permissions)) {
            return true;
        } else {
            return false;
        }
    }

    // TODO: пока только для admin
    public function forceDelete(User $user, Model $model): bool
    {
        $permissions = $this->getPermissions($user, 'forceDelete', $model);

        if(in_array('admin', $permissions)) {
            return true;
        } else {
            return false;
        }
    }
}