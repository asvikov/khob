import React, { useState, useEffect } from 'react';
import FormValidateService from '../../../services/FormValidateService';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
        <div className="user-details">
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

                                        {data.profile && (
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
        </div>
    );
}

export default Edit;