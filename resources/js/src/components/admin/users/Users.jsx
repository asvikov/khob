import React, { useState } from 'react';
import List from './List';
import Edit from './Edit';
import View from './View';
import { useUsers } from '../../../hooks/useUsers';

const Users = () => {
    const [editUserId, setEditUserId] = useState(false);
    const [viewUserId, setViewUserId] = useState(false);
    const { data, isLoading, error } = useUsers();

    const handleViewClick = (id) => {
        setEditUserId(false);
        setViewUserId(id);
    }

    const handleEditClick = (id) => {

        if(id) {
            setViewUserId(false);
            setEditUserId(id);
        } else {
            setViewUserId(false);
            setEditUserId(true);
        }
    }

    const handleCloseUserDetails = () => {
        setEditUserId(false);
        setViewUserId(false);
    }

    return (
        <div className="users-container">
            {(!viewUserId && !editUserId) && (
                <div>
                <List 
                    users={data}
                    onEdit={handleEditClick}
                    onView={handleViewClick}
                    loading={isLoading}
                    error={error}
                />
                </div>
            )}
            {editUserId && (
                <div>
                <Edit 
                    userId={editUserId}
                    onClose={handleCloseUserDetails}
                />
                </div>
            )}
            {viewUserId && (
                <div>
                <View 
                    userId={viewUserId}
                    onEdit={handleEditClick}
                    onClose={handleCloseUserDetails}
                />
                </div>
            )}
        </div>
    );
}

export default Users;