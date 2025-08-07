import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { FaBus, FaClock, FaMapMarkerAlt, FaUsers, FaRupeeSign } from 'react-icons/fa';

const BusBookingPage = () => {
  const [step, setStep] = useState(1);
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busSeats, setBusSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
      const response = await bookingService.searchBuses(searchData);
      setBuses(response.data);
      setStep(2);
    } catch (err) {
      setError('Failed to search buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = async (bus) => {
    setSelectedBus(bus);
    setLoading(true);
    
    try {
      const response = await bookingService.getBusSeats(bus.id);
      setBusSeats(response.data);
      setStep(3);
    } catch (err) {
      setError('Failed to load seat information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    if (seat.is_booked) return;
    
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length < 6) { // Maximum 6 seats
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert('Maximum 6 seats can be selected');
      }
    }
  };

  const handleSeatConfirm = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    // Initialize passenger data
    const passengerList = selectedSeats.map(() => ({
      name: '',
      age: '',
      gender: 'male'
    }));
    setPassengers(passengerList);
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
        booking_type: 'bus',
        bus: selectedBus.id,
        selected_seats: selectedSeats.map(seat => seat.seat_number),
        journey_date: searchData.date,
        total_passengers: selectedSeats.length,
        total_amount: (selectedBus.price_per_seat * selectedSeats.length) + 50, // +50 platform fee
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

  const renderSeatMap = () => {
    const rows = [];
    const seatsPerRow = 4;
    
    for (let i = 0; i < busSeats.length; i += seatsPerRow) {
      const rowSeats = busSeats.slice(i, i + seatsPerRow);
      rows.push(
        <Row key={i} className="mb-2 justify-content-center">
          {rowSeats.map((seat, index) => {
            const isSelected = selectedSeats.find(s => s.id === seat.id);
            const seatClass = seat.is_booked 
              ? 'btn-danger' 
              : isSelected 
                ? 'btn-success' 
                : 'btn-outline-primary';
            
            return (
              <Col key={seat.id} xs={2} className="px-1">
                <Button
                  variant=""
                  className={`w-100 seat-btn ${seatClass}`}
                  size="sm"
                  onClick={() => handleSeatSelect(seat)}
                  disabled={seat.is_booked}
                  style={{ minHeight: '40px' }}
                >
                  {seat.seat_number}
                </Button>
              </Col>
            );
          })}
          {/* Add aisle space after 2 seats */}
          {i % 8 === 0 && <Col xs={1}></Col>}
        </Row>
      );
    }
    
    return rows;
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FaBus className="me-2 text-success" />
            Bus Booking
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
            <h5 className="mb-0">Search Buses</h5>
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
              <Button type="submit" variant="success" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Searching...
                  </>
                ) : (
                  'Search Buses'
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Step 2: Bus Results */}
      {step === 2 && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Available Buses ({buses.length})</h5>
            <Button variant="outline-success" onClick={() => setStep(1)}>
              Modify Search
            </Button>
          </div>
          
          {buses.map((bus) => (
            <Card key={bus.id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <h6 className="mb-2 text-success fw-bold">
                      {bus.bus_name} ({bus.bus_number})
                    </h6>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-3">
                        <strong>{bus.source}</strong> → <strong>{bus.destination}</strong>
                      </span>
                    </div>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaClock className="me-1" />
                      <span className="me-3">
                        {formatTime(bus.departure_time)} - {formatTime(bus.arrival_time)}
                      </span>
                      <span>Duration: {formatDuration(bus.travel_duration)}</span>
                    </div>
                    <div>
                      <Badge bg="success" className="me-2">
                        {bus.available_seats} seats available
                      </Badge>
                      <span className="text-success fw-bold">
                        <FaRupeeSign />
                        {bus.price_per_seat} per seat
                      </span>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button
                      variant="success"
                      onClick={() => handleBusSelect(bus)}
                      disabled={bus.available_seats === 0}
                    >
                      {bus.available_seats === 0 ? 'Sold Out' : 'Select Seats'}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Step 3: Seat Selection */}
      {step === 3 && selectedBus && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Select Seats - {selectedBus.bus_name}</h5>
            <Button variant="outline-success" onClick={() => setStep(2)}>
              Back to Buses
            </Button>
          </div>
          
          <Row>
            <Col md={8}>
              <Card>
                <Card.Header className="text-center">
                  <h6 className="mb-0">Bus Seat Layout</h6>
                  <small className="text-muted">Driver</small>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                      <p className="mt-2">Loading seats...</p>
                    </div>
                  ) : (
                    <div className="seat-map">
                      {renderSeatMap()}
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <div className="mt-3">
                <Row>
                  <Col xs={4} className="text-center">
                    <Button variant="outline-primary" size="sm" disabled>
                      Available
                    </Button>
                  </Col>
                  <Col xs={4} className="text-center">
                    <Button variant="success" size="sm" disabled>
                      Selected
                    </Button>
                  </Col>
                  <Col xs={4} className="text-center">
                    <Button variant="danger" size="sm" disabled>
                      Booked
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
            
            <Col md={4}>
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Booking Summary</h6>
                </Card.Header>
                <Card.Body>
                  <p><strong>Bus:</strong> {selectedBus.bus_name}</p>
                  <p><strong>Route:</strong> {selectedBus.source} → {selectedBus.destination}</p>
                  <p><strong>Date:</strong> {searchData.date}</p>
                  <hr />
                  <p><strong>Selected Seats:</strong></p>
                  <div className="mb-3">
                    {selectedSeats.length > 0 ? (
                      <div>
                        {selectedSeats.map(seat => (
                          <Badge key={seat.id} bg="success" className="me-1 mb-1">
                            {seat.seat_number}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No seats selected</p>
                    )}
                  </div>
                  <hr />
                  <div className="mb-3">
                    <p className="mb-1">Ticket Price: ₹{selectedBus.price_per_seat} × {selectedSeats.length}</p>
                    <p className="mb-1">Platform Fee: ₹50</p>
                    <h6 className="text-success">
                      Total: ₹{(selectedBus.price_per_seat * selectedSeats.length) + 50}
                    </h6>
                  </div>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={handleSeatConfirm}
                    disabled={selectedSeats.length === 0}
                  >
                    Continue
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Step 4: Passenger Details */}
      {step === 4 && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Passenger Details</h5>
            <Button variant="outline-success" onClick={() => setStep(3)}>
              Back to Seat Selection
            </Button>
          </div>
          
          <Card>
            <Card.Body>
              {passengers.map((passenger, index) => (
                <div key={index} className="mb-4">
                  <h6 className="text-success mb-3">
                    Passenger {index + 1} - Seat {selectedSeats[index]?.seat_number}
                  </h6>
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
                  Ticket Price: ₹{selectedBus?.price_per_seat} × {selectedSeats.length} = ₹{selectedBus?.price_per_seat * selectedSeats.length}
                </h6>
                <h6 className="mb-2">Platform Fee: ₹50</h6>
                <h5 className="text-success">
                  Total Amount: ₹{(selectedBus?.price_per_seat * selectedSeats.length) + 50}
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
    </Container>
  );
};

export default BusBookingPage;