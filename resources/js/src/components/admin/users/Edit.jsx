import React, { useState, useEffect } from 'react';
import FormValidateService from '../../../services/FormValidateService';
import FormatDate from '../../../services/FormatDate';
import { useNavigate } from 'react-router-dom';
import { useUser, useCreateUser, useUpdateUser, useDeleteUser } from '../../../hooks/useUsers';

const Edit = ({ userId, onClose }) => {

    const [corr_inputs, setCorrInputs] = useState({});
    const [error_message, setErrorMessage] = useState('');
    const formatDate = new FormatDate();
    const navigate = useNavigate();
    const is_create = (userId === true);
    const { data, isLoading, error } = is_create ? {data: {}, isLoading: false, error: false} : useUser(userId);
    const handleResponseOb = {
        onError: (error) => {
            if(error.status === 403) {
                setErrorMessage('нет прав');
            }

            if(error.status === 422) {
                setErrorMessage(error.message);
            }
        }
    }
    const { mutate: createUser, isPending } = useCreateUser(handleResponseOb);
    const { mutate: updateUser } = useUpdateUser(handleResponseOb);
    const { mutate: deleteUser } = useDeleteUser(handleResponseOb);


    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        conf_password: '',
        banned: false,
        description: '',
        birth: '',
    });

    useEffect(() => {
        if (!is_create && data) {
            setFormData({
                first_name: data.name || '',
                last_name: data.last_name || '',
                email: data.email || '',
                password: '',
                conf_password: '',
                banned: !!Number(data.banned),
                description: data.profile?.description || '',
                birth: data.profile?.birth || '',
            });
        }
    }, [data]);

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    const handleCancel = () => {
        setCorrInputs({});
        setErrorMessage('');
        onClose();
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (corr_inputs[field] === false) {
            setCorrInputs(prev => ({
                ...prev,
                [field]: true
            }));
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const valid = new FormValidateService();
        let is_corr = {};
        let req_data = {};

        const hasChangedNormalize = (newVal, oldVal) => {
            const normalizedNew = newVal === null || newVal === undefined ? '' : String(newVal);
            const normalizedOld = oldVal === null || oldVal === undefined ? '' : String(oldVal);
            return normalizedNew !== normalizedOld;
        };

        if (formData.first_name !== data.name || is_create) {
            is_corr.first_name = valid.min(4).check(formData.first_name);
            if (is_corr.first_name) {
                req_data.name = formData.first_name;
            }
        }

        if (formData.last_name !== data.last_name || is_create) {
            is_corr.last_name = valid.min(4).check(formData.last_name);
            if (is_corr.last_name) {
                req_data.last_name = formData.last_name;
            }
        }

        if (formData.email !== data.email || is_create) {
            is_corr.email = valid.email().check(formData.email);
            if (is_corr.email) {
                req_data.email = formData.email;
            }
        }

        if (formData.password.length > 0 || is_create) {
            is_corr.password = valid.equal(formData.conf_password).min(4).check(formData.password);
            if (is_corr.password) {
                req_data.password = formData.password;
            }
        }

        if (formData.banned !== !!Number(data.banned)) {
            req_data.banned = Number(formData.banned);
        }

        if (hasChangedNormalize(formData.description, data.profile?.description)) {
            req_data.description = formData.description;
        }

        if (hasChangedNormalize(formData.birth, data.profile?.birth)) {
            req_data.birth = formData.birth;
        }

        if (!valid.lastChecks()) {
            setCorrInputs(is_corr);
            setErrorMessage('Исправьте поля выделенные красным');
            valid.resetLastChecks();
        } else {
            if (Object.keys(req_data).length > 0) {
                if(is_create) {
                    createUser(req_data);
                } else {
                    updateUser({userId: data.id, userData: req_data});
                }
            } else {
                setErrorMessage('Нет изменений для сохранения');
            }
        }
    }

    const handleDelete = () => {
       deleteUser(data.id);
    }

    return (
        <div className="user-details max-w-4xl mx-auto mt-8 px-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Имя</label>
                    <input
                        type='text'
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            corr_inputs.first_name === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                        value={formData.first_name}
                        placeholder='Введите имя'
                        onChange={(e) => handleChange('first_name', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Фамилия</label>
                    <input
                        type='text'
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            corr_inputs.last_name === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                        value={formData.last_name}
                        placeholder='Введите фамилию'
                        onChange={(e) => handleChange('last_name', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                        type='email'
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            corr_inputs.email === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                        value={formData.email}
                        placeholder='Введите свой email'
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                </div>

                {data.profile && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">О себе</label>
                            <input
                                type='text'
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">д.р.</label>
                            <input
                                type='date'
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                value={formatDate.toInputDate(formData.birth)}
                                onChange={(e) => handleChange('birth', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Задать пароль</label>
                    <input
                        type='password'
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            corr_inputs.password === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                        value={formData.password}
                        placeholder='Задать пароль'
                        onChange={(e) => handleChange('password', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Подтверждение пароля</label>
                    <input
                        type='password'
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            corr_inputs.password === false ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        }`}
                        value={formData.conf_password}
                        placeholder='Подтвердите пароль'
                        onChange={(e) => handleChange('conf_password', e.target.value)}
                    />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type='checkbox'
                        checked={formData.banned}
                        onChange={(e) => handleChange('banned', e.target.checked)}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-slate-700">Заблокирован</span>
                </label>

                {!is_create && (
                    <button
                        type='button'
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                        удалить пользователя ✘
                    </button>
                )}

                <div className='text-danger text-sm'>{error_message}</div>

                <div className="flex gap-3">
                    <button
                        type='submit'
                        disabled={isPending}
                        className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Сохранить
                    </button>
                    <button
                        type='button'
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Edit;