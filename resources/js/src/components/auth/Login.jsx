import {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLogin } from '../../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error_message, setErrorMessage] = useState('');
    const { mutate: login, isPending } = useLogin({
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        let request_body = {
            'email':email,
            'password':password,
        };

        login(request_body);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col lg={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={email} placeholder='введите свой email' onChange={handleEmailChange} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type='password' value={password} placeholder='введите пароль' onChange={handlePasswordChange} />
                        </Form.Group>
                        <Button variant='primary' type='submit'>Войти</Button>
                    </Form>
                    <div className='text-danger'>{error_message}</div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
