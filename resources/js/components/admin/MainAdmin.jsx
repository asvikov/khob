import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from './navigation/Navigation';
import AuthService from '../services/AuthService';

const MainAdmin = () => {
    let Auth = new AuthService();

    if(Auth.admin || Auth.view_admin) {
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
    } else {
        return <Navigate to='/login' />;
    }
}

export default MainAdmin;
