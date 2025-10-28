import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';

const Navigation = () => {
    return (
        <Navbar expand="md" bg="secondary">
        <Navbar.Toggle aria-controls="navbar-adm" />
        <Navbar.Collapse id="navbar-adm">
            <Nav defaultActiveKey="/admin" className="flex-column me-auto">
                <Link to="/admin" className="nav-link">dashboard</Link>
                <Link to="/admin/users" className="nav-link">users</Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
