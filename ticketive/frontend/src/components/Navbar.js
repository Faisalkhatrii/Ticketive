import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaTrain, FaBus, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>
            <strong>Ticketive</strong>
          </BootstrapNavbar.Brand>
        </LinkContainer>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            
            {isAuthenticated && (
              <>
                <LinkContainer to="/train-booking">
                  <Nav.Link>
                    <FaTrain className="me-1" />
                    Train Booking
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/bus-booking">
                  <Nav.Link>
                    <FaBus className="me-1" />
                    Bus Booking
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/my-bookings">
                  <Nav.Link>My Bookings</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link disabled>
                  <FaUser className="me-1" />
                  Welcome, {user?.first_name || user?.username}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;