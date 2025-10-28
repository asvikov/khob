import React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import AjaxQuery from '../../services/AjaxOuery';
import AuthService from "../../services/AuthService";

const Dashboard = () => {
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

    return (
        <div>
            <div>Пользователь: {user.name}</div>
            <Button variant='primary' onClick={handleLogout}>Выйти</Button>
        </div>
    );
}

export default Dashboard;
