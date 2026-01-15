import React from 'react';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../../hooks/useUsers';
import FormatDate from '../../../services/FormatDate';

const View = ({ userId, onEdit, onClose }) => {
    const { data, isLoading, error } = useUser(userId);
    const formatDate = new FormatDate();

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <div>Аватар: {data.avatar}</div>
            <div>{data.last_name} {data.name}</div>
            <div>Email: {data.email}</div>
            <div>Статус: {data.banned ? 'заблокирован' : 'активен'}</div>
            {data.parent_user_id && (
                <div>Является соредактором для: {data.parent_user_id}</div>
            )}
            {data.profile && (
                <div>
                    <div>Профиль</div>
                    <div>д.р.: {formatDate.toViewDate(data.profile.birth)}</div>
                    {data.profile.description && (
                        <div>О себе: {data.profile.description}</div>
                    )}
                </div>
            )}
            <div>
                <Button
                    variant='primary'
                    className='me-1'
                    onClick={() => { onEdit(data.id); }}
                >
                    Редактировать
                </Button>
                <Button
                    variant='primary'
                    onClick={onClose}
                >
                    Закрыть
                </Button>
            </div>
        </div>
    );
}

export default View;