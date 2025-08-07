import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { FaTicketAlt, FaDownload, FaFilePdf, FaFileImage } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TicketPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ticketRef = useRef();

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await bookingService.getBookingDetails(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPNG = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        const link = document.createElement('a');
        link.download = `ticket-${booking.booking_id}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (err) {
        console.error('Error generating PNG:', err);
        alert('Failed to generate PNG. Please try again.');
      }
    }
  };

  const downloadAsPDF = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 10;
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`ticket-${booking.booking_id}.pdf`);
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading ticket details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Ticket not found or you don't have permission to view this ticket.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaTicketAlt className="me-2 text-success" />
              Your Ticket
            </h2>
            <div>
              <Button variant="outline-primary" className="me-2" onClick={downloadAsPNG}>
                <FaFileImage className="me-1" />
                PNG
              </Button>
              <Button variant="outline-danger" onClick={downloadAsPDF}>
                <FaFilePdf className="me-1" />
                PDF
              </Button>
            </div>
          </div>

          {/* Ticket */}
          <div ref={ticketRef} className="ticket-container">
            <Card className="shadow-lg border-0 ticket-card">
              <Card.Header className="bg-primary text-white text-center py-3">
                <h4 className="mb-0">🎫 TICKETIVE</h4>
                <small>Your Travel Partner</small>
              </Card.Header>
              
              <Card.Body className="p-4">
                {/* Booking Status */}
                <div className="text-center mb-4">
                  <Badge bg="success" className="fs-6 px-3 py-2">
                    ✓ CONFIRMED
                  </Badge>
                  <h5 className="mt-2 text-primary">Booking ID: {booking.booking_id}</h5>
                </div>

                <hr />

                {/* Journey Details */}
                <Row className="mb-4">
                  <Col md={6}>
                    <h6 className="text-muted mb-3">JOURNEY DETAILS</h6>
                    {booking.booking_type === 'train' ? (
                      <>
                        <p className="mb-2">
                          <strong>Train:</strong> {booking.train_details?.train_name} 
                          ({booking.train_details?.train_number})
                        </p>
                        <p className="mb-2">
                          <strong>Coach:</strong> {booking.coach_details?.coach_type_display}
                        </p>
                        <p className="mb-2">
                          <strong>Route:</strong> {booking.train_details?.source} → {booking.train_details?.destination}
                        </p>
                        <p className="mb-2">
                          <strong>Departure:</strong> {formatTime(booking.train_details?.departure_time)}
                        </p>
                        <p className="mb-0">
                          <strong>Arrival:</strong> {formatTime(booking.train_details?.arrival_time)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mb-2">
                          <strong>Bus:</strong> {booking.bus_details?.bus_name} 
                          ({booking.bus_details?.bus_number})
                        </p>
                        <p className="mb-2">
                          <strong>Seats:</strong> {booking.selected_seats?.join(', ')}
                        </p>
                        <p className="mb-2">
                          <strong>Route:</strong> {booking.bus_details?.source} → {booking.bus_details?.destination}
                        </p>
                        <p className="mb-2">
                          <strong>Departure:</strong> {formatTime(booking.bus_details?.departure_time)}
                        </p>
                        <p className="mb-0">
                          <strong>Arrival:</strong> {formatTime(booking.bus_details?.arrival_time)}
                        </p>
                      </>
                    )}
                  </Col>
                  
                  <Col md={6}>
                    <h6 className="text-muted mb-3">BOOKING DETAILS</h6>
                    <p className="mb-2">
                      <strong>Journey Date:</strong> {formatDate(booking.journey_date)}
                    </p>
                    <p className="mb-2">
                      <strong>Passengers:</strong> {booking.total_passengers}
                    </p>
                    <p className="mb-2">
                      <strong>Payment Status:</strong> 
                      <Badge bg="success" className="ms-2">
                        {booking.payment_status.toUpperCase()}
                      </Badge>
                    </p>
                    <p className="mb-2">
                      <strong>Total Amount:</strong> ₹{booking.total_amount}
                    </p>
                    <p className="mb-0">
                      <strong>Booked On:</strong> {new Date(booking.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </Col>
                </Row>

                <hr />

                {/* Passenger Details */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">PASSENGER DETAILS</h6>
                  <Row>
                    {booking.passengers?.map((passenger, index) => (
                      <Col md={6} key={index} className="mb-2">
                        <div className="border rounded p-2">
                          <strong>{passenger.name}</strong><br />
                          <small className="text-muted">
                            Age: {passenger.age} | Gender: {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}
                            {passenger.seat_number && ` | Seat: ${passenger.seat_number}`}
                          </small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                <hr />

                {/* Important Notes */}
                <div className="bg-light rounded p-3">
                  <h6 className="text-muted mb-2">IMPORTANT NOTES</h6>
                  <ul className="small mb-0 text-muted">
                    <li>Please carry a valid photo ID proof during travel</li>
                    <li>Reach the boarding point at least 15 minutes before departure</li>
                    <li>This ticket is non-transferable and non-refundable</li>
                    <li>For any queries, contact our customer support</li>
                  </ul>
                </div>

                {/* QR Code Placeholder */}
                <div className="text-center mt-4">
                  <div 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      border: '2px solid #ddd',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <small className="text-muted">QR Code</small>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Scan for verification
                  </small>
                </div>
              </Card.Body>

              <Card.Footer className="bg-light text-center py-2">
                <small className="text-muted">
                  Generated on {new Date().toLocaleString('en-IN')} | Ticketive.com
                </small>
              </Card.Footer>
            </Card>
          </div>

          {/* Download Section */}
          <Card className="mt-4">
            <Card.Body className="text-center">
              <h6 className="mb-3">Download Your Ticket</h6>
              <p className="text-muted mb-3">
                Save your ticket for offline access and easy reference during travel
              </p>
              <Button variant="primary" className="me-2" onClick={downloadAsPNG}>
                <FaDownload className="me-1" />
                Download as PNG
              </Button>
              <Button variant="danger" onClick={downloadAsPDF}>
                <FaDownload className="me-1" />
                Download as PDF
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TicketPage;