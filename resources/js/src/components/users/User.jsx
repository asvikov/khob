import React from "react";
import AuthService from "../../services/AuthService";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import AjaxQuery from '../../services/AjaxOuery';

const User = () => {
    const Auth = new AuthService();
    const user = Auth.getUser();
    const navigate = useNavigate();

    const handleRedirect = () => {
        Auth.logout();
        navigate('/login');
    };

    const handleLogout = (event) => {
        AjaxQuery('/api/logout', handleRedirect, 'POST');
    }

    if(Auth.check) {
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
