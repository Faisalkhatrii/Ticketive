import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTrain, FaBus, FaStar, FaShieldAlt, FaClock } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookingClick = (type) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/${type}-booking`);
    }
  };

  return (
    <div>
      {/* Hero Carousel */}
      <Carousel className="mb-5">
        <Carousel.Item>
          <div
            className="d-block w-100"
            style={{
              height: '400px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Container>
              <Row className="text-center text-white">
                <Col>
                  <h1 className="display-4 fw-bold mb-3">Welcome to Ticketive</h1>
                  <p className="lead">Your one-stop solution for train and bus bookings</p>
                  <Button variant="light" size="lg" className="mt-3">
                    Get Started
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
        
        <Carousel.Item>
          <div
            className="d-block w-100"
            style={{
              height: '400px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Container>
              <Row className="text-center text-white">
                <Col>
                  <h1 className="display-4 fw-bold mb-3">Book Train Tickets</h1>
                  <p className="lead">Fast, secure, and convenient train booking experience</p>
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="mt-3"
                    onClick={() => handleBookingClick('train')}
                  >
                    Book Now
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
        
        <Carousel.Item>
          <div
            className="d-block w-100"
            style={{
              height: '400px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Container>
              <Row className="text-center text-white">
                <Col>
                  <h1 className="display-4 fw-bold mb-3">Book Bus Tickets</h1>
                  <p className="lead">Comfortable bus journeys at affordable prices</p>
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="mt-3"
                    onClick={() => handleBookingClick('bus')}
                  >
                    Book Now
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      <Container>
        {/* Booking Options */}
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="mb-4">Choose Your Journey</h2>
            <p className="text-muted">Select from our wide range of travel options</p>
          </Col>
        </Row>
        
        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="h-100 shadow-sm booking-card">
              <Card.Body className="text-center p-4">
                <FaTrain size={60} className="text-primary mb-3" />
                <Card.Title className="h3 mb-3">Train Booking</Card.Title>
                <Card.Text className="text-muted mb-4">
                  Book train tickets across India with multiple class options including 
                  Sleeper, AC 3-tier, AC 2-tier, and AC 1st class.
                </Card.Text>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={() => handleBookingClick('train')}
                >
                  Book Train Tickets
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100 shadow-sm booking-card">
              <Card.Body className="text-center p-4">
                <FaBus size={60} className="text-success mb-3" />
                <Card.Title className="h3 mb-3">Bus Booking</Card.Title>
                <Card.Text className="text-muted mb-4">
                  Comfortable bus journeys with seat selection feature. 
                  Choose from AC and non-AC buses for your convenient travel.
                </Card.Text>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100"
                  onClick={() => handleBookingClick('bus')}
                >
                  Book Bus Tickets
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="mb-4">Why Choose Ticketive?</h2>
          </Col>
        </Row>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="text-center border-0">
              <Card.Body>
                <FaStar size={40} className="text-warning mb-3" />
                <Card.Title>Easy Booking</Card.Title>
                <Card.Text className="text-muted">
                  Simple and intuitive booking process with just a few clicks
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="text-center border-0">
              <Card.Body>
                <FaShieldAlt size={40} className="text-primary mb-3" />
                <Card.Title>Secure Payment</Card.Title>
                <Card.Text className="text-muted">
                  Safe and secure payment options with Google Pay integration
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="text-center border-0">
              <Card.Body>
                <FaClock size={40} className="text-success mb-3" />
                <Card.Title>24/7 Support</Card.Title>
                <Card.Text className="text-muted">
                  Round-the-clock customer support for all your travel needs
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;