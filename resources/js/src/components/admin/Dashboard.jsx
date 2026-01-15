import React from 'react';
import Button from 'react-bootstrap/Button';
import authService from "../../services/authService";
import { useLogout } from '../../hooks/useAuth';

const Dashboard = () => {
    const user = authService.getUser();
    const { mutate: logout } = useLogout();

    const handleLogout = (event) => {
        logout();
    }

    return (
        <div>
            <div>Пользователь: {user.name}</div>
            <Button variant='primary' onClick={handleLogout}>Выйти</Button>
        </div>
    );
}

export default Dashboard;
