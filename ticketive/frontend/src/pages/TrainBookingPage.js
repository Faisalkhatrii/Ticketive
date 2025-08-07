import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { FaTrain, FaClock, FaMapMarkerAlt, FaUsers, FaRupeeSign } from 'react-icons/fa';

const TrainBookingPage = () => {
  const [step, setStep] = useState(1);
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await bookingService.searchTrains(searchData);
      setTrains(response.data);
      setStep(2);
    } catch (err) {
      setError('Failed to search trains. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setStep(3);
  };

  const handleCoachSelect = (coach) => {
    setSelectedCoach(coach);
    setShowPassengerModal(true);
  };

  const handlePassengerSubmit = () => {
    const passengerList = [];
    for (let i = 0; i < passengerCount; i++) {
      passengerList.push({
        name: '',
        age: '',
        gender: 'male'
      });
    }
    setPassengers(passengerList);
    setShowPassengerModal(false);
    setStep(4);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        booking_type: 'train',
        train: selectedTrain.id,
        train_coach: selectedCoach.id,
        journey_date: searchData.date,
        total_passengers: passengerCount,
        total_amount: (selectedCoach.price_per_seat * passengerCount) + 50, // +50 platform fee
        passengers_data: passengers
      };

      const response = await bookingService.createBooking(bookingData);
      navigate(`/payment/${response.data.booking_id}`);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (duration) => {
    const match = duration.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FaTrain className="me-2 text-primary" />
            Train Booking
          </h2>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Step 1: Search Form */}
      {step === 1 && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Search Trains</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSearch}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-2" />
                      From
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="source"
                      value={searchData.source}
                      onChange={handleSearchChange}
                      placeholder="Enter source city"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-2" />
                      To
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="destination"
                      value={searchData.destination}
                      onChange={handleSearchChange}
                      placeholder="Enter destination city"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Journey Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={searchData.date}
                      onChange={handleSearchChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="primary" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Searching...
                  </>
                ) : (
                  'Search Trains'
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Step 2: Train Results */}
      {step === 2 && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Available Trains ({trains.length})</h5>
            <Button variant="outline-primary" onClick={() => setStep(1)}>
              Modify Search
            </Button>
          </div>
          
          {trains.map((train) => (
            <Card key={train.id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <h6 className="mb-2 text-primary fw-bold">
                      {train.train_name} ({train.train_number})
                    </h6>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-3">
                        <strong>{train.source}</strong> → <strong>{train.destination}</strong>
                      </span>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <FaClock className="me-1" />
                      <span className="me-3">
                        {formatTime(train.departure_time)} - {formatTime(train.arrival_time)}
                      </span>
                      <span>Duration: {formatDuration(train.travel_duration)}</span>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button
                      variant="primary"
                      onClick={() => handleTrainSelect(train)}
                    >
                      Select Train
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Step 3: Coach Selection */}
      {step === 3 && selectedTrain && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Select Coach - {selectedTrain.train_name}</h5>
            <Button variant="outline-primary" onClick={() => setStep(2)}>
              Back to Trains
            </Button>
          </div>
          
          <Row>
            {selectedTrain.coaches.map((coach) => (
              <Col md={6} lg={4} key={coach.id} className="mb-3">
                <Card className="h-100 coach-card">
                  <Card.Body className="text-center">
                    <h6 className="text-primary mb-3">{coach.coach_type_display}</h6>
                    <div className="mb-3">
                      <Badge bg="success" className="me-2">
                        {coach.available_seats} seats available
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <h5 className="text-success">
                        <FaRupeeSign />
                        {coach.price_per_seat}
                      </h5>
                      <small className="text-muted">per person</small>
                    </div>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleCoachSelect(coach)}
                      disabled={coach.available_seats === 0}
                    >
                      {coach.available_seats === 0 ? 'Sold Out' : 'Select'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Step 4: Passenger Details */}
      {step === 4 && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Passenger Details</h5>
            <Button variant="outline-primary" onClick={() => setStep(3)}>
              Back to Coach Selection
            </Button>
          </div>
          
          <Card>
            <Card.Body>
              {passengers.map((passenger, index) => (
                <div key={index} className="mb-4">
                  <h6 className="text-primary mb-3">Passenger {index + 1}</h6>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          placeholder="Age"
                          min="1"
                          max="100"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}
              
              <hr />
              
              <div className="text-end">
                <h6 className="mb-2">
                  Ticket Price: ₹{selectedCoach?.price_per_seat} × {passengerCount} = ₹{selectedCoach?.price_per_seat * passengerCount}
                </h6>
                <h6 className="mb-2">Platform Fee: ₹50</h6>
                <h5 className="text-success">
                  Total Amount: ₹{(selectedCoach?.price_per_seat * passengerCount) + 50}
                </h5>
              </div>
              
              <div className="text-end mt-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleBookingSubmit}
                  disabled={loading || passengers.some(p => !p.name || !p.age)}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Passenger Count Modal */}
      <Modal show={showPassengerModal} onHide={() => setShowPassengerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Number of Passengers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              <FaUsers className="me-2" />
              How many passengers?
            </Form.Label>
            <Form.Control
              type="number"
              value={passengerCount}
              onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
              min="1"
              max="6"
            />
            <Form.Text className="text-muted">
              Maximum 6 passengers per booking
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPassengerModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePassengerSubmit}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TrainBookingPage;