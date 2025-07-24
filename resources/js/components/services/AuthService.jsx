class AuthService {

    constructor() {
        this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
        this.admin = this.isAdmin();
        this.view_admin = this.isViewAdmin();
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

    isViewAdmin() {

        let is_can = false;

        if(this.user.roles) {
            for(let role of this.user.roles) {
                if(role.name === 'view_admin') {
                    is_can = true;
                    break;
                }
            }
        }
        return is_can;
    }

    canViewAdmin() {

        return (this.admin || this.view_admin) ? true : false;
    }

    canUser(entity, action = 'viewAny') {

        let is_can = false;

        if(this.user.roles) {
            for(let role of this.user.roles) {
                if(role.name === 'admin' || role.name === 'view_admin') {
                    is_can = true;
                    break;
                }
            }
        }
        return is_can;
    }
}

export default AuthService;
