import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { FaCreditCard, FaQrcode, FaUpload, FaCheckCircle } from 'react-icons/fa';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await bookingService.getBookingDetails(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    if (method === 'googlepay') {
      setShowQRModal(true);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedFile) {
      setError('Please upload payment screenshot');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('payment_screenshot', selectedFile);

      await bookingService.uploadPaymentScreenshot(bookingId, formData);
      setPaymentStep(3);
      
      // Simulate payment verification delay
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        navigate(`/ticket/${bookingId}`);
      }, 10000); // 10 seconds verification

    } catch (err) {
      setError('Failed to upload payment screenshot. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading payment details...</p>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Booking not found or you don't have permission to view this booking.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">
            <FaCreditCard className="me-2 text-primary" />
            Payment - {booking.booking_id}
          </h2>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Booking Summary */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Booking Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                  <p><strong>Type:</strong> {booking.booking_type.toUpperCase()}</p>
                  <p><strong>Journey Date:</strong> {booking.journey_date}</p>
                  <p><strong>Passengers:</strong> {booking.total_passengers}</p>
                </Col>
                <Col md={6}>
                  {booking.booking_type === 'train' ? (
                    <>
                      <p><strong>Train:</strong> {booking.train_details?.train_name}</p>
                      <p><strong>Route:</strong> {booking.train_details?.source} → {booking.train_details?.destination}</p>
                      <p><strong>Coach:</strong> {booking.coach_details?.coach_type_display}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Bus:</strong> {booking.bus_details?.bus_name}</p>
                      <p><strong>Route:</strong> {booking.bus_details?.source} → {booking.bus_details?.destination}</p>
                      <p><strong>Seats:</strong> {booking.selected_seats?.join(', ')}</p>
                    </>
                  )}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col className="text-end">
                  <h5 className="text-success">
                    Total Amount: ₹{booking.total_amount}
                  </h5>
                  <small className="text-muted">
                    (Including ₹{booking.platform_fee} platform fee)
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Payment Steps */}
          {paymentStep === 1 && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Select Payment Method</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Card 
                      className="payment-method-card h-100 cursor-pointer"
                      onClick={() => handlePaymentMethodSelect('googlepay')}
                    >
                      <Card.Body className="text-center">
                        <FaQrcode size={48} className="text-primary mb-3" />
                        <h6>Google Pay</h6>
                        <p className="text-muted mb-0">Pay using Google Pay QR Code</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card className="payment-method-card h-100 opacity-50">
                      <Card.Body className="text-center">
                        <FaCreditCard size={48} className="text-muted mb-3" />
                        <h6 className="text-muted">Other Methods</h6>
                        <p className="text-muted mb-0">Coming Soon</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Upload Screenshot */}
          {paymentStep === 2 && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Upload Payment Screenshot</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-4">
                  <Alert variant="info">
                    <strong>Payment Completed?</strong><br />
                    Please upload a screenshot of your successful Google Pay transaction for verification.
                  </Alert>
                </div>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaUpload className="me-2" />
                    Select Screenshot
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    size="lg"
                  />
                  <Form.Text className="text-muted">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </Form.Text>
                </Form.Group>

                {selectedFile && (
                  <Alert variant="success" className="mb-4">
                    <FaCheckCircle className="me-2" />
                    File selected: {selectedFile.name}
                  </Alert>
                )}

                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePaymentSubmit}
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Uploading...
                      </>
                    ) : (
                      'Submit Payment Proof'
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Verification */}
          {paymentStep === 3 && (
            <Card>
              <Card.Body className="text-center py-5">
                {verifying ? (
                  <>
                    <Spinner animation="border" size="lg" className="mb-3" />
                    <h5>Verifying Payment...</h5>
                    <p className="text-muted">
                      Please wait while we verify your payment. This may take up to 10 seconds.
                    </p>
                    <div className="mt-4">
                      <div className="progress">
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={64} className="text-success mb-3" />
                    <h5 className="text-success">Payment Verified!</h5>
                    <p className="text-muted">
                      Your payment has been successfully verified. Redirecting to your ticket...
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Google Pay QR Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Google Pay QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <div 
              style={{ 
                width: '200px', 
                height: '200px', 
                border: '2px solid #ddd',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div className="text-center">
                <FaQrcode size={80} className="text-muted" />
                <p className="small text-muted mt-2">QR Code Placeholder</p>
              </div>
            </div>
          </div>
          
          <h6>Amount: ₹{booking.total_amount}</h6>
          <p className="text-muted small">
            Scan this QR code with your Google Pay app to complete the payment
          </p>
          
          <Alert variant="warning" className="small">
            <strong>Demo Mode:</strong> This is a simulated payment process. 
            In production, this would show a real Google Pay QR code.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowQRModal(false);
              setPaymentStep(2);
            }}
          >
            I've Made the Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaymentPage;