import React from 'react';
import authService from "../../services/authService";
import { useLogout } from '../../hooks/useAuth';

const Dashboard = () => {
    const user = authService.getUser();
    const { mutate: logout } = useLogout();

    const handleLogout = (event) => {
        logout();
    }

    return (
        <div className="space-y-4">
            <div>Пользователь: {user.name}</div>
            <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
            >
                Выйти
            </button>
        </div>
    );
}

export default Dashboard;
