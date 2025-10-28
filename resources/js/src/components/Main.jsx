import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Outlet } from 'react-router-dom';
import MainMenu from './navigation/MainMenu';

const Main = () => {
    return (
        <Container className="mt-3 px-0">
                <Row>
                    <Col md="4">
                        <MainMenu />
                    </Col>
                    <Col>
                        <Outlet />
                    </Col>
                </Row>
        </Container>
    );
}

export default Main;
