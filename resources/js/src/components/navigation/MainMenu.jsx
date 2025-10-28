import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const MainMenu = () => {
    return (
        <Navbar expand="md" bg="secondary">
        <Navbar.Toggle aria-controls="main-menu" />
        <Navbar.Collapse id="main-menu">
            <Nav defaultActiveKey="/" className="flex-column me-auto">
                <Link to="/" className="nav-link">все события</Link>
                <Link to="/users" className="nav-link">профиль</Link>
                <Link to="/occasions" className="nav-link">мои события</Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}

export default MainMenu;
