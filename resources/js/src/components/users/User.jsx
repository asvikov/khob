import React from "react";
import authService from "../../services/authService";
import { Navigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useLogout } from "../../hooks/useAuth";

const User = () => {
    const user = authService.getUser();
    const { mutate: logout } = useLogout();

    const handleLogout = (event) => {
        logout();
    }

    if(authService.check) {
        return (
            <div>
                <div>Имя: {user.name}</div>
                <div>email: {user.email}</div>
                <div>
                    <Button variant='primary' onClick={handleLogout}>Выйти</Button>
                </div>
            </div>
        );
    } else {
        return <Navigate to='/login' />;
    }
}

export default User;
