import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import '../../scss/custom.scss';
import Main from './components/Main';
import MainAdmin from './components/admin/MainAdmin';
import Dashboard from './components/admin/Dashboard';
import AdminUsers from './components/admin/users/Users';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Occasion from './components/occasions/Occasion';
import User from './components/users/User';

const appelem = ReactDOM.createRoot(document.getElementById('app'));

function AppRoutes() {
    const location = useLocation();
    
    return (
        <Routes>
            <Route path="/" element={<Main />}>
                <Route index element={<Occasion />} />
                <Route path='/users' element={<User />} />
                <Route path='/occasions' element={<Occasion />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<MainAdmin key={location.pathname} />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<AdminUsers key={location.key} />} />
            </Route>
            <Route path="*" element={<div>ресурс не найден</div>} />
        </Routes>
    );
}

appelem.render(
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
);