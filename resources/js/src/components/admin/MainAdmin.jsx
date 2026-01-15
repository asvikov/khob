import React from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from './navigation/Navigation';
import authService from '../../services/authService';

const MainAdmin = () => {
    const check_user = authService.check();
    const navigate = useNavigate();

    useEffect(() => {
        if (!check_user) {
            navigate('/login');
        }
    }, [check_user]);
    
    if(!authService.canViewAdmin()) {
        return <Navigate to='/login' />;
    }

    return (
        <Container className="mt-3 px-0">
            <Row>
                <Col md="4">
                    <Navigation />
                </Col>
                <Col>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
}

export default MainAdmin;
