import api from './api';

export const bookingService = {
  searchTrains: (searchData) => {
    return api.post('/booking/search-trains/', searchData);
  },

  searchBuses: (searchData) => {
    return api.post('/booking/search-buses/', searchData);
  },

  getBusSeats: (busId) => {
    return api.get(`/booking/bus-seats/${busId}/`);
  },

  createBooking: (bookingData) => {
    return api.post('/booking/create-booking/', bookingData);
  },

  uploadPaymentScreenshot: (bookingId, formData) => {
    return api.post(`/booking/upload-payment/${bookingId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUserBookings: () => {
    return api.get('/booking/my-bookings/');
  },

  getBookingDetails: (bookingId) => {
    return api.get(`/booking/booking/${bookingId}/`);
  }
};