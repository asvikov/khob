import React from "react";
import authService from "../../services/authService";
import { Navigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";

const User = () => {
    const user = authService.getUser();
    const { mutate: logout } = useLogout();

    const handleLogout = (event) => {
        logout();
    }

    if(authService.check) {
        return (
            <div className="space-y-3">
                <div>Имя: {user.name}</div>
                <div>email: {user.email}</div>
                <div>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        );
    } else {
        return <Navigate to='/login' />;
    }
}

export default User;
