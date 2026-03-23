import React from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import authService from '../../services/authService';

const MainAdmin = () => {
    const check_user = authService.check();
    const navigate = useNavigate();

    useEffect(() => {
        if (!check_user) {
            navigate('/login');
        }
    }, [check_user]);

    if(!authService.canViewAdmin()) {
        return <Navigate to='/login' />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-80 flex-shrink-0">
                        <Navigation />
                    </div>
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainAdmin;
