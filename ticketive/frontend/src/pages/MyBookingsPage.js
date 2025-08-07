import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { FaHistory, FaEye, FaDownload, FaTrain, FaBus } from 'react-icons/fa';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleViewTicket = (bookingId) => {
    navigate(`/ticket/${bookingId}`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FaHistory className="me-2 text-primary" />
            My Bookings
          </h2>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <FaHistory size={64} className="text-muted mb-3" />
            <h5>No Bookings Found</h5>
            <p className="text-muted">You haven't made any bookings yet.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Start Booking
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {bookings.map((booking) => (
            <Col lg={6} key={booking.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {booking.booking_type === 'train' ? (
                      <FaTrain className="me-2 text-primary" />
                    ) : (
                      <FaBus className="me-2 text-success" />
                    )}
                    <strong>{booking.booking_id}</strong>
                  </div>
                  <Badge bg={getStatusVariant(booking.payment_status)}>
                    {booking.payment_status.toUpperCase()}
                  </Badge>
                </Card.Header>

                <Card.Body>
                  {booking.booking_type === 'train' ? (
                    <>
                      <h6 className="text-primary mb-2">
                        {booking.train_details?.train_name} ({booking.train_details?.train_number})
                      </h6>
                      <p className="mb-2">
                        <strong>Route:</strong> {booking.train_details?.source} → {booking.train_details?.destination}
                      </p>
                      <p className="mb-2">
                        <strong>Coach:</strong> {booking.coach_details?.coach_type_display}
                      </p>
                      <p className="mb-2">
                        <strong>Departure:</strong> {formatTime(booking.train_details?.departure_time)}
                      </p>
                    </>
                  ) : (
                    <>
                      <h6 className="text-success mb-2">
                        {booking.bus_details?.bus_name} ({booking.bus_details?.bus_number})
                      </h6>
                      <p className="mb-2">
                        <strong>Route:</strong> {booking.bus_details?.source} → {booking.bus_details?.destination}
                      </p>
                      <p className="mb-2">
                        <strong>Seats:</strong> {booking.selected_seats?.join(', ')}
                      </p>
                      <p className="mb-2">
                        <strong>Departure:</strong> {formatTime(booking.bus_details?.departure_time)}
                      </p>
                    </>
                  )}
                  
                  <hr />
                  
                  <Row>
                    <Col xs={6}>
                      <small className="text-muted">Journey Date</small>
                      <p className="mb-2"><strong>{formatDate(booking.journey_date)}</strong></p>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted">Passengers</small>
                      <p className="mb-2"><strong>{booking.total_passengers}</strong></p>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted">Total Amount</small>
                      <p className="mb-2 text-success"><strong>₹{booking.total_amount}</strong></p>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted">Booked On</small>
                      <p className="mb-2"><strong>{formatDate(booking.created_at)}</strong></p>
                    </Col>
                  </Row>
                </Card.Body>

                <Card.Footer className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {booking.booking_type.toUpperCase()} BOOKING
                    </small>
                    <div>
                      {booking.payment_status === 'completed' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewTicket(booking.booking_id)}
                        >
                          <FaEye className="me-1" />
                          View Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookingsPage;