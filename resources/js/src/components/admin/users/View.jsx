import React from 'react';
import { useUser } from '../../../hooks/useUsers';
import FormatDate from '../../../services/FormatDate';

const View = ({ userId, onEdit, onClose }) => {
    const { data, isLoading, error } = useUser(userId);
    const formatDate = new FormatDate();

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="space-y-3">
            <div>Аватар: {data.avatar}</div>
            <div>{data.last_name} {data.name}</div>
            <div>Email: {data.email}</div>
            <div>Статус: {data.banned ? 'заблокирован' : 'активен'}</div>
            {data.parent_user_id && (
                <div>Является соредактором для: {data.parent_user_id}</div>
            )}
            {data.profile && (
                <div className="space-y-2">
                    <div className="font-medium text-slate-700">Профиль</div>
                    <div>д.р.: {formatDate.toViewDate(data.profile.birth)}</div>
                    {data.profile.description && (
                        <div>О себе: {data.profile.description}</div>
                    )}
                </div>
            )}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={() => { onEdit(data.id); }}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
                >
                    Редактировать
                </button>
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
}

export default View;