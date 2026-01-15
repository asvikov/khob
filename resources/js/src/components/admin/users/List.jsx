import React from 'react';
import EyeSvg from '../../../svg/EyeSvg';

const List = ({ users, onEdit, onView, loading = false, error = null }) => {
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <div role="button" onClick={() => onEdit(null)}>создать пользователя</div>
            <div>список пользователей:</div>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} {user.email}
                        <span
                            role="button"
                            onClick={() => onView(user.id)}
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                        >
                            <EyeSvg />
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default List;