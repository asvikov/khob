class AuthService {

    constructor() {
        this.user = this.getUserFromStorage();
        this.admin = this.isAdmin();
        this.view_admin = this.hasRole('view_admin');
    }

    getUserFromStorage() {

        let st_user = localStorage.getItem('user');

        if(st_user !== null && st_user.length) {

            try {
                return JSON.parse(st_user);
            } catch (error) {
                console.error('user in localStorage is not valid JSON');
            }
        } else {
            return {};
        }
    }

    getUser() {

        return this.user;
    }

    logout() {

        this.user = {};
        this.admin = false;
        this.view_admin = false;
        localStorage.removeItem('user');
    }

    check() {

        return this.user.name ? true : false;
    }

    isAdmin() {

        let admin = false;

        if(this.user.roles) {
            for(let role of this.user.roles) {
                if(role.name === 'admin') {
                    admin = true;
                    break;
                }
            }
        }
        return admin;
    }

    canViewAdmin() {

        return (this.admin || this.view_admin) ? true : false;
    }

    hasRole(role_name) {

        let has = false;

        if(this.user.roles) {
            for(let role of this.user.roles) {
                if(role.name === role_name) {
                    has = true;
                    break;
                }
            }
        }
        return has;
    }

    /**
     * check permission
     * @param {string} entity - name entity (example: user, profile, occasion) 
     * @param {string} action - name permission (example: viewAny, view, create, update, delete)
     * @param {string|null} entity_id - the id of entity
     */
    can(entity, action = 'viewAny', entity_id = null) {

        let is_can = false;
        let entity_permissions = [];

        if(this.user.roles) {
            for(let role of this.user.roles) {

                for(let entity_name_ob of role.permissions) {

                    if(entity_name_ob === entity) {
                        entity_permissions.push(entity_name_ob);
                    }
                }
            }
        }

        console.log(entity_permissions);
        return is_can;
    }
}

export default AuthService;
