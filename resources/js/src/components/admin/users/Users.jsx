import React, { useEffect, useState } from 'react';
import AjaxQuery from '../../../services/AjaxOuery';
import List from './List';
import Edit from './Edit';

const Users = (forceUpdate) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [is_create, setIsCreate] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        setError(null);
        AjaxQuery('/api/users', handleUsersResponse);
    }

    const handleUsersResponse = (response) => {
        setLoading(false);
        if (response.status === 200 && response.data) {
            setUsers(response.data);
        } else {
            setError('Ошибка загрузки списка пользователей');
        }
    }

    const handleUserDataResponse = (response) => {
        setLoading(false);
        if (response.status === 200 && response.data) {
            setSelectedUser(response.data);
        } else {
            setError('Ошибка загрузки данных пользователя');
        }
    }

    const handleEditClick = (userId) => {
        setLoading(true);
        setError(null);

        if(userId) {
            AjaxQuery('/api/users/' + userId, handleUserDataResponse);
        } else {
            setIsCreate(true);
            setLoading(false);
            setSelectedUser({});
        }
    }

    const handleCloseUserDetails = () => {
        setSelectedUser(null);
    }

    return (
        <div className="users-container">
            {selectedUser ? (
                <Edit 
                    user={selectedUser}
                    onClose={handleCloseUserDetails}
                    loading={loading}
                    error={error}
                    is_create={is_create}
                />
            ) : (
                <List 
                    users={users}
                    onEditClick={handleEditClick}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
}

export default Users;