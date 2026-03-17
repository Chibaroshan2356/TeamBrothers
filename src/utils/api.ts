// API utility for consistent API calls across the application

const API_URL = 'https://teambrothers.onrender.com'; // Force production URL

export const API = {
  // Base URL
  BASE_URL: API_URL,
  
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    GOOGLE: `${API_URL}/api/auth/google`,
  },
  
  // Bookings endpoints
  BOOKINGS: {
    BASE: `${API_URL}/api/bookings`,
    MY: `${API_URL}/api/bookings/my`,
    FEEDBACK: `${API_URL}/api/bookings/feedback`,
    CANCEL: (id: string) => `${API_URL}/api/bookings/${id}/cancel`,
    STATUS: (id: string) => `${API_URL}/api/bookings/${id}/status`,
    DETAIL: (id: string) => `${API_URL}/api/bookings/${id}`,
  },
  
  // Analytics endpoints
  ANALYTICS: {
    BASE: `${API_URL}/api/analytics/analytics`,
    VEHICLE_USAGE: `${API_URL}/api/analytics/vehicle-usage`,
    TOP_ROUTES: `${API_URL}/api/analytics/top-routes`,
    MONTHLY_BOOKINGS: `${API_URL}/api/analytics/monthly-bookings`,
  },
  
  // Vehicles endpoints
  VEHICLES: {
    AVAILABILITY: (id: string) => `${API_URL}/api/vehicles/${id}/availability`,
    BOOKED_DATES: (id: string) => `${API_URL}/api/availability/booked-dates/${id}`,
  },
  
  // Contact endpoint
  CONTACT: `${API_URL}/api/contact`,
  
  // Helper function to get auth headers
  getAuthHeaders: (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }),
  
  // Helper function to get headers without auth
  getHeaders: () => ({
    'Content-Type': 'application/json',
  }),
};

export default API;
