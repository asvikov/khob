import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AjaxQuery from '../../services/AjaxOuery';
import FormValidateService from '../../services/FormValidateService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conf_password, setConfPassword] = useState('');
    const [radio_val, setRadioVal] = useState('own');
    const [pn_options, setPnOptions] = useState([]);
    const [parent_id, setParentId] = useState(false);
    const [parent_elem, setParentElem] = useState('');
    const [error_message, setErrorMessage] = useState('');
    const [corr_inputs, setCorrInputs] = useState({});
    const valid = new FormValidateService();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let is_corr = {
            'first_name':valid.min(4).check(first_name),
            'last_name':valid.min(4).check(last_name),
            'email':valid.email().check(email),
            'password':valid.equal(conf_password).min(4).check(password)
        };

        if(!valid.lastChecks()) {
            setCorrInputs(is_corr);
            setErrorMessage('исправьте поля выделенные красным');
            valid.resetLastChecks();
        } else {
            let data = {
                'first_name':first_name,
                'last_name':last_name,
                'email':email,
                'password':password
            }

            if(parent_id) {
                data.parent_id = parent_id;
            }
            AjaxQuery('/api/register', handleResponse, 'POST', data);
        }
    }

    const handleResponse = (responce) => {

        if(responce.errors && responce.message) {
            setErrorMessage(responce.message);
        } else {
            if(responce.status === 200) {
                let json_user = JSON.stringify(responce.data.user);
                localStorage.setItem('user', json_user);

                return navigate('/users');
            }
        }
    }

    const handleRadio = (event) => {
        setRadioVal(event.target.value);

        if(event.target.value === 'own') {
            setParentId(false);
            setPnOptions([]);
        }
    }

    const setHtmlPnOptions = (query_data) => {
        if(query_data.status === 200) {
            let html = query_data.data.map((user) => {
                user.img_src = user.avatar ? user.avatar : '/storage/img/no_img_avatar.webp';
                let div = <div key={user.id} className="my-mod-lis-elem" onClick={() => handlePickParUser(user)}><img src={user.img_src} /><div>{user.name+' '+user.last_name}</div></div>;
                return div;
            });

            setPnOptions(html);
        }
    }

    const handleParentName = (event) => {
        if(event.target.value.length > 2) {
            AjaxQuery('/api/forregisterusers', setHtmlPnOptions, 'POST', {'name':event.target.value});
        } else {
            setPnOptions([]);
        }
    }

    const handlePickParUser = (user) => {
        setParentId(user.id);
        setPnOptions([]);
        setParentElem(<div className="my-mod-lis-elem"><img src={user.img_src} /><div>{user.name+' '+user.last_name}</div><div role='button' onClick={handleDelParUs}>&#10060;</div></div>);
    }

    const handleDelParUs = () => {
        setParentId(false);
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col lg={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type='text' className={(corr_inputs.first_name === false) ? 'is-invalid' : ''} value={first_name} placeholder='введите имя' onChange={(e) => setFirstName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control type='text' className={(corr_inputs.last_name === false) ? 'is-invalid' : ''} value={last_name} placeholder='введите фамилию' onChange={(e) => setLastName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' className={(corr_inputs.email === false) ? 'is-invalid' : ''} value={email} placeholder='введите свой email' onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type='password' className={(corr_inputs.password === false) ? 'is-invalid' : ''} value={password} placeholder='введите пароль' onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type='password' className={(corr_inputs.password === false) ? 'is-invalid' : ''} value={conf_password} placeholder='подтвердите пароль' onChange={(e) => setConfPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Check type='radio' name='group1' value='own' label='основной аккаунт' checked={radio_val === 'own'} onChange={handleRadio} />
                        <Form.Check type='radio' name='group1' value='coown' label='аккаунт помошник. Создайте такой аккаунту, чтобы следить или помогать основному аккаунту (рекомендуется родителям)' checked={radio_val === 'coown'} onChange={handleRadio} />
                        <Form.Group className='mb-3' hidden={parent_id}>
                            <Form.Label>К кому вы хотите прсоединиться</Form.Label>
                            <Form.Control type='text' placeholder='начните вводить имя' disabled={radio_val === 'own'} onChange={handleParentName} />
                            <div className='my-modal-container' hidden={!pn_options.length}>
                                <div className='form-control my-modal-list'>
                                    {pn_options}
                                </div>
                            </div>
                        </Form.Group>
                        <div hidden={!parent_id}>
                            <div className='form-control'>
                                {parent_elem}
                            </div>
                        </div>
                        <div className='mb-2 text-danger'>{error_message}</div>
                        <Button variant='primary' type='submit'>Зарегистрироваться</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
