import React, { useState, useEffect } from 'react';
import AjaxQuery from '../../../services/AjaxOuery';
import FormValidateService from '../../../services/FormValidateService';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormatDate from '../../../services/FormatDate';
import { useNavigate } from 'react-router-dom';

const Edit = ({ user, onClose, loading = false, error = null, is_create = false }) => {
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return null;

    const [is_edit_or_crete, setIsEdit] = useState(is_create);
    const [corr_inputs, setCorrInputs] = useState({});
    const [error_message, setErrorMessage] = useState('');
    const formatDate = new FormatDate();
    const navigate = useNavigate();
    
    // Инициализируем состояния значениями из user
    const [formData, setFormData] = useState({
        first_name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        conf_password: '',
        banned: !!Number(user.banned) || false,
        description: user.profile?.description || '',
        birth: user.profile?.birth || '',
    });

    // Обновляем formData при изменении user
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                password: '',
                conf_password: '',
                banned: !!Number(user.banned),
                description: user.profile?.description || '',
                birth: user.profile?.birth || '',
            });
        }
    }, [user]);

    const toggleEdit = () => {
        setIsEdit(!is_edit_or_crete);
        // Сбрасываем ошибки при переключении режима
        setCorrInputs({});
        setErrorMessage('');
    }

    const handleCancel = () => {
        if(is_create) {
            return navigate('/admin/users');
        } else {
            toggleEdit();
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Сбрасываем ошибку для поля при изменении
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
        let data = {};

        const hasChangedNormalize = (newVal, oldVal) => {
            const normalizedNew = newVal === null || newVal === undefined ? '' : String(newVal);
            const normalizedOld = oldVal === null || oldVal === undefined ? '' : String(oldVal);
            return normalizedNew !== normalizedOld;
        };

        if (formData.first_name !== user.name || is_create) {
            is_corr.first_name = valid.min(4).check(formData.first_name);
            if (is_corr.first_name) {
                data.name = formData.first_name;
            }
        }

        if (formData.last_name !== user.last_name || is_create) {
            is_corr.last_name = valid.min(4).check(formData.last_name);
            if (is_corr.last_name) {
                data.last_name = formData.last_name;
            }
        }

        if (formData.email !== user.email || is_create) {
            is_corr.email = valid.email().check(formData.email);
            if (is_corr.email) {
                data.email = formData.email;
            }
        }

        if (formData.password.length > 0 || is_create) {
            is_corr.password = valid.equal(formData.conf_password).min(4).check(formData.password);
            if (is_corr.password) {
                data.password = formData.password;
            }
        }

        if (formData.banned !== !!Number(user.banned)) {
            data.banned = Number(formData.banned);
        }

        if (hasChangedNormalize(formData.description, user.profile?.description)) {
            data.description = formData.description;
        }

        if (hasChangedNormalize(formData.birth, user.profile?.birth)) {
            data.birth = formData.birth;
        }

        if (!valid.lastChecks()) {
            setCorrInputs(is_corr);
            setErrorMessage('Исправьте поля выделенные красным');
            valid.resetLastChecks();
        } else {
            if (Object.keys(data).length > 0) {
                if(is_create) {
                    AjaxQuery('/api/users/', handleResponse, 'POST', data);
                } else {
                    let url = '/api/users/'+user.id;
                    AjaxQuery(url, handleResponse, 'PUT', data);
                }
            } else {
                setErrorMessage('Нет изменений для сохранения');
            }
        }
    }

    const handleDelete = () => {
        let url = '/api/users/'+user.id;
        AjaxQuery(url, handleDeleteResponse, 'DELETE');
    }

    const handleDeleteResponse = (response) => {
        if (response.status === 200) {
            return navigate('/admin/users');
        } else {
            setErrorMessage('Ошибка удаления');
        }
    }

    const handleResponse = (response) => {
        if (response.status === 200 && response.data) {
            return navigate('/admin/users');
        } else if(response.status === 422 && response?.data.message) {
            setErrorMessage(response?.data.message);
        } else {
            setErrorMessage('Ошибка сохранения');
        }
    }

    return (
        <div className="user-details">
            {is_edit_or_crete ? (
                <div>
                    <div>
                        <Container className="mt-3">
                            <Row>
                                <Col lg={8}>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Имя</Form.Label>
                                            <Form.Control 
                                                type='text' 
                                                className={(corr_inputs.first_name === false) ? 'is-invalid' : ''} 
                                                value={formData.first_name} 
                                                placeholder='Введите имя' 
                                                onChange={(e) => handleChange('first_name', e.target.value)} 
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Фамилия</Form.Label>
                                            <Form.Control 
                                                type='text' 
                                                className={(corr_inputs.last_name === false) ? 'is-invalid' : ''} 
                                                value={formData.last_name} 
                                                placeholder='Введите фамилию' 
                                                onChange={(e) => handleChange('last_name', e.target.value)} 
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control 
                                                type='email' 
                                                className={(corr_inputs.email === false) ? 'is-invalid' : ''} 
                                                value={formData.email} 
                                                placeholder='Введите свой email' 
                                                onChange={(e) => handleChange('email', e.target.value)} 
                                            />
                                        </Form.Group>

                                        {user.profile && (
                                            <div>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>О себе</Form.Label>
                                                    <Form.Control 
                                                        type='text' 
                                                        value={formData.description}  
                                                        onChange={(e) => handleChange('description', e.target.value)} 
                                                    />
                                                </Form.Group>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>д.р.</Form.Label>
                                                    <Form.Control 
                                                        type='date' 
                                                        value={formatDate.toInputDate(formData.birth)} 
                                                        onChange={(e) => handleChange('birth', e.target.value)} 
                                                    />
                                                </Form.Group>
                                            </div>
                                        )}
                                        
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Задать пароль</Form.Label>
                                            <Form.Control 
                                                type='password' 
                                                className={(corr_inputs.password === false) ? 'is-invalid' : ''} 
                                                value={formData.password} 
                                                placeholder='Задать пароль' 
                                                onChange={(e) => handleChange('password', e.target.value)} 
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Подтверждение пароля</Form.Label>
                                            <Form.Control 
                                                type='password' 
                                                className={(corr_inputs.password === false) ? 'is-invalid' : ''} 
                                                value={formData.conf_password} 
                                                placeholder='Подтвердите пароль' 
                                                onChange={(e) => handleChange('conf_password', e.target.value)} 
                                            />
                                        </Form.Group>
                                        
                                        <Form.Check 
                                            type='checkbox' 
                                            label='Заблокирован' 
                                            checked={formData.banned}
                                            onChange={(e) => handleChange('banned', e.target.checked)} 
                                            className='mb-2'
                                        />
                                        {!is_create && (<div role='button' className='mb-3' onClick={handleDelete}>удалить пользователя ✘</div>)}
                                        <div className='mb-2 text-danger'>{error_message}</div>
                                        <Button variant='primary' type='submit' className='me-1'>
                                            Сохранить
                                        </Button>
                                        <Button variant='primary' onClick={handleCancel}>
                                            Отмена
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            ) : (
                <div>
                    <div>Аватар: {user.avatar}</div>
                    <div>{user.last_name} {user.name}</div>
                    <div>Email: {user.email}</div>
                    <div>Статус: {user.banned ? 'заблокирован' : 'активен'}</div>
                    {user.parent_user_id && (
                        <div>Является соредактором для: {user.parent_user_id}</div>
                    )}
                    {user.profile && (
                        <div>
                            <div>Профиль</div>
                            <div>д.р.: {formatDate.toViewDate(user.profile.birth)}</div>
                            {user.profile.description && (
                                <div>О себе: {user.profile.description}</div>
                            )}
                        </div>
                    )}
                    <div>
                        <Button 
                            variant='primary' 
                            className='me-1'
                            onClick={toggleEdit}
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
            )}
        </div>
    );
}

export default Edit;