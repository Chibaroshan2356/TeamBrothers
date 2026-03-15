import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vehicles as initialVehicles, Vehicle, Booking, BookingStatus } from '@/data/vehicles';

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { name: string; email: string; role: string; createdAt?: string; rewardPoints?: number; tier?: string; totalBookings?: number } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setIsAdmin: (value: boolean) => void;
  
  // Vehicles
  vehicles: Vehicle[];
  toggleVehicleAvailability: (vehicleId: string) => void;
  refreshVehicleData: () => void;
  
  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  
  // Analytics
  getAnalytics: () => {
    totalEnquiries: number;
    pendingEnquiries: number;
    approvedEnquiries: number;
    mostRequestedVehicle: { name: string; count: number } | null;
    tripTypeDistribution: Record<string, number>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Load data from localStorage or use defaults
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Save data to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => 
    loadFromStorage('vehicles', initialVehicles)
  );

  // Function to refresh vehicle data from initial import
  const refreshVehicleData = () => {
    localStorage.removeItem('vehicles');
    setVehicles(initialVehicles);
  };
  const [bookings, setBookings] = useState<Booking[]>(() => 
    loadFromStorage('bookings', [])
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() => 
    localStorage.getItem('isAdmin') === 'true'
  );
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Admin credentials (in a real app, this would be handled by a backend)
  const ADMIN_EMAIL = 'admin23@gmail.com';
  const ADMIN_PASSWORD = 'admin123';

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setIsAdmin(data.user.role === 'admin');
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdmin', String(data.user.role === 'admin'));
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Persist vehicles to localStorage
  useEffect(() => {
    saveToStorage('vehicles', vehicles);
  }, [vehicles]);

  // Persist bookings to localStorage
  useEffect(() => {
    saveToStorage('bookings', bookings);
  }, [bookings]);

  // Persist admin state
  useEffect(() => {
    saveToStorage('isAdmin', isAdmin);
  }, [isAdmin]);

  // Persist user state
  useEffect(() => {
    if (user) {
      saveToStorage('user', user);
    }
  }, [user]);

  const toggleVehicleAvailability = (vehicleId: string) => {
    setVehicles(prev => 
      prev.map(v => 
        v.id === vehicleId ? { ...v, available: !v.available } : v
      )
    );
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `BK${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status } : b
      )
    );
  };

  const getAnalytics = () => {
    const totalEnquiries = bookings.length;
    const pendingEnquiries = bookings.filter(b => b.status === 'pending').length;
    const approvedEnquiries = bookings.filter(b => b.status === 'approved').length;

    // Count requests per vehicle
    const vehicleRequests: Record<string, number> = {};
    bookings.forEach(b => {
      vehicleRequests[b.vehicleName] = (vehicleRequests[b.vehicleName] || 0) + 1;
    });

    // Find most requested
    let mostRequestedVehicle: { name: string; count: number } | null = null;
    Object.entries(vehicleRequests).forEach(([name, count]) => {
      if (!mostRequestedVehicle || count > mostRequestedVehicle.count) {
        mostRequestedVehicle = { name, count };
      }
    });

    // Trip type distribution
    const tripTypeDistribution: Record<string, number> = {};
    bookings.forEach(b => {
      tripTypeDistribution[b.tripType] = (tripTypeDistribution[b.tripType] || 0) + 1;
    });

    return {
      totalEnquiries,
      pendingEnquiries,
      approvedEnquiries,
      mostRequestedVehicle,
      tripTypeDistribution,
    };
  };

  return (
    <AppContext.Provider value={{
      // Auth
      isAuthenticated,
      isAdmin,
      user,
      login,
      logout,
      setIsAdmin,
      
      // Vehicles
      vehicles,
      toggleVehicleAvailability,
      refreshVehicleData,
      
      // Bookings
      bookings,
      addBooking,
      updateBookingStatus,
      
      // Analytics
      getAnalytics,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
