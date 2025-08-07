# Ticketive - Bus & Train Booking Website

A comprehensive bus and train booking platform built with React frontend and Django backend.

## Features

### 🎫 Complete Booking System
- **Train Booking**: Search trains, select coaches (Sleeper, 3A, 2A, 1A), passenger details
- **Bus Booking**: Search buses, interactive seat selection, passenger management
- **Multi-passenger Support**: Book for up to 6 passengers per booking

### 🔐 User Authentication
- User registration and login
- Protected routes for authenticated users
- JWT token-based authentication

### 💳 Payment System
- Google Pay QR code integration (simulated)
- Payment screenshot upload for verification
- 10-second payment verification process
- Platform fee calculation (₹50 per booking)

### 🎟️ Digital Tickets
- Professional ticket generation
- Download tickets as PNG or PDF
- Complete booking and passenger details
- QR code for verification

### 📱 Modern UI/UX
- Responsive Bootstrap design
- Interactive carousel on homepage
- Smooth animations and transitions
- Mobile-friendly interface

## Technology Stack

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Bootstrap 5** + React Bootstrap for UI
- **Axios** for API calls
- **React Icons** for icons
- **jsPDF** + html2canvas for ticket downloads

### Backend
- **Django 5.2** with Django REST Framework
- **SQLite** database (development)
- **Token Authentication**
- **Django CORS Headers**
- **Pillow** for image handling
- **ReportLab** for PDF generation

## Project Structure

```
ticketive/
├── backend/                 # Django Backend
│   ├── authentication/     # User auth app
│   ├── booking/            # Booking management app
│   ├── ticketive_backend/  # Main Django project
│   ├── manage.py
│   └── requirements.txt
└── frontend/               # React Frontend
    ├── public/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── context/       # React context
    │   └── App.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create sample data**
   ```bash
   python manage.py populate_data
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```

   Frontend will be available at: `http://localhost:3000`

## Usage Guide

### 1. User Registration/Login
- Visit the homepage
- Click "Register" to create a new account
- Or "Login" with existing credentials

### 2. Train Booking
- Click "Train Booking" from navigation or homepage
- Enter source, destination, and journey date
- Select from available trains
- Choose coach type (Sleeper, 3A, 2A, 1A)
- Enter passenger details
- Proceed to payment

### 3. Bus Booking
- Click "Bus Booking" from navigation or homepage
- Enter source, destination, and journey date
- Select from available buses
- Choose seats from interactive seat map
- Enter passenger details
- Proceed to payment

### 4. Payment Process
- Select Google Pay payment method
- Scan QR code (simulated)
- Upload payment screenshot
- Wait for 10-second verification
- Get redirected to ticket page

### 5. View Tickets
- Access tickets from "My Bookings"
- Download as PNG or PDF
- View complete booking details

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `GET /api/auth/check-auth/` - Check authentication status

### Booking
- `POST /api/booking/search-trains/` - Search trains
- `POST /api/booking/search-buses/` - Search buses
- `GET /api/booking/bus-seats/{id}/` - Get bus seats
- `POST /api/booking/create-booking/` - Create booking
- `POST /api/booking/upload-payment/{booking_id}/` - Upload payment screenshot
- `GET /api/booking/my-bookings/` - Get user bookings
- `GET /api/booking/booking/{booking_id}/` - Get booking details

## Sample Data

The application comes with pre-populated sample data:
- **10 Trains** with different routes and coach types
- **15 Buses** with various routes and pricing
- **Multiple Cities**: Mumbai, Delhi, Bangalore, Chennai, etc.
- **Random Pricing**: Realistic fare structures

## Features Implemented

✅ User authentication and authorization  
✅ Train search and booking with multiple coach types  
✅ Bus search and booking with seat selection  
✅ Interactive seat map for buses  
✅ Multi-passenger booking support  
✅ Payment integration with screenshot upload  
✅ Ticket generation and download (PNG/PDF)  
✅ Booking history and management  
✅ Responsive design for all devices  
✅ Professional UI with smooth animations  
✅ Form validation and error handling  
✅ Protected routes and authentication flow  

## Development Notes

### Database Models
- **CustomUser**: Extended user model with phone and DOB
- **Train/TrainCoach**: Train and coach information
- **Bus/BusSeat**: Bus and seat management
- **Booking**: Central booking model for both trains and buses
- **Passenger**: Individual passenger details

### Key Components
- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Route protection for authenticated users
- **Multi-step Booking**: Wizard-style booking process
- **Responsive Design**: Mobile-first approach

### Payment Simulation
- QR code display (placeholder)
- Screenshot upload functionality
- 10-second verification delay
- Automatic status updates

## Future Enhancements

- Real payment gateway integration
- Email notifications
- SMS confirmations
- Advanced search filters
- Seat preferences
- Cancellation and refund system
- Admin dashboard
- Real-time seat availability
- Push notifications
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is developed for demonstration purposes.

## Support

For any issues or questions, please create an issue in the repository or contact the development team.

---

**Ticketive** - Your trusted travel booking partner! 🚂🚌