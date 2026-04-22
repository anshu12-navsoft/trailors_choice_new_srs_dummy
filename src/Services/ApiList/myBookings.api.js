import api from '../../config/api';

export const getBookingsAPI = ({ statuses, page = 1, search = '' }) => {
  return api.get('/bookings/', {
    params: {
      status: statuses?.join(','), // ongoing,coming,booked etc.
      page,
      search,
    },
  });
};

export const getBookingDetailsAPI = bookingId => {
  return api.get(`/bookings/${bookingId}/`);
};

export const downloadInvoiceAPI = bookingId => {
  return api.get(`/bookings/${bookingId}/invoice/`, {
    responseType: 'blob', // important for file download
  });
};
