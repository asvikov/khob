// DEPRECATED: This service is deprecated. Please use React Query auth hooks instead.
// See: resources/js/src/services/authService.js

const authService = {

    _user: null,
    _admin: null,
    _view_admin: null,

    getUser: function() {
        
        if(this._user === null) {
            let st_user = localStorage.getItem('user');

            if(st_user !== null && st_user.length) {

                try {
                    this._user = JSON.parse(st_user);
                } catch (error) {
                    this.logout();
                    console.error('user in localStorage is not valid JSON');
                    return {};
                }
            } else {
                this._user = {};
            }
        }
        return this._user;
    },

    setUserFromResponse: function(response) {

        if(response.data?.user && response.data?.user !== null && typeof(response.data?.user) === 'object') {

            if(response.data.user.id) {
                let json_user = JSON.stringify(response.data.user);
                localStorage.setItem('user', json_user);
                this._user = response.data.user;
                this._admin = this.isAdmin();
                this._view_admin = this.hasRole('view_admin');
                return true;
            }
        }
        return false;
    },

    logout: function() {
        this._user = null;
        this._admin = null;
        this._view_admin = null;
        localStorage.removeItem('user');
    },

    check: function() {
        let user = this.getUser();
        return user?.id ? true : false;
    },

    isAdmin: function() {

        if(this._admin === null) {
            let admin = false;
            let user = this.getUser();

            if(user.roles) {
                for(let role of user.roles) {
                    if(role.name === 'admin') {
                        admin = true;
                        break;
                    }
                }
            }
            this._admin = admin;
        }
        return this._admin;
    },

    canViewAdmin: function() {

        if(this.isAdmin()) {
            return true;
        }

        if(this._view_admin === null) {
            this._view_admin = this.hasRole('view_admin');
        }
        return this._view_admin;
    },

    hasRole: function(role_name) {
        let has = false;
        let user = this.getUser();

        if(user.roles) {
            for(let role of user.roles) {
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
    /*
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
        */
};

export default authService;
