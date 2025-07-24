import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/bootstrap.min.css';
import Main from './components/Main';
import MainAdmin from './components/admin/MainAdmin';
import Dashboard from './components/admin/Dashboard';
import Users from './components/admin/users/Users';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Occasion from './components/occasions/Occasion';
import User from './components/users/User';

const appelem = ReactDOM.createRoot(document.getElementById('app'));

appelem.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />}>
                <Route index element={<Occasion />} />
                <Route path='/users' element={<User />} />
                <Route path='/occasions' element={<Occasion />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<MainAdmin />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
            </Route>
            <Route path="*" element={<div>ресурс не найден</div>} />
        </Routes>
    </BrowserRouter>
);


