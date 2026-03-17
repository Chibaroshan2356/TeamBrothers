import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Car, FileText, BarChart3, 
  CheckCircle, Clock, XCircle, Users, TrendingUp,
  ToggleLeft, ToggleRight, Eye, X, MapPin, Calendar, Phone, Mail, DollarSign, MessageSquare, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';
import { BookingStatus, tripTypeLabels } from '@/data/vehicles';
import { cn } from '@/lib/utils';

/**
 * Admin Dashboard Component
 * 
 * Features:
 * - View all enquiries with status
 * - Toggle vehicle availability
 * - Simple analytics (most requested vehicle, trip distribution)
 * - Role-based access (only visible in Admin mode)
 */

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-warning text-warning-foreground', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500 text-white', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive text-destructive-foreground', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-green-500 text-white', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-gray-500 text-white', icon: XCircle },
  approved: { label: 'Approved', color: 'bg-emerald-500 text-white', icon: CheckCircle }
};

const Admin = () => {
  const navigate = useNavigate();
  const { 
    isAdmin, 
    vehicles, 
    toggleVehicleAvailability, 
    getAnalytics 
  } = useApp();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>({
    totalUsers: 156,
    totalVehicles: 24,
    activeVehicles: 18,
    totalEnquiries: 89,
    completedTrips: 342,
    totalRevenue: 48750,
    avgRating: 4.6
  });
  const [vehicleUsage, setVehicleUsage] = useState<any[]>([
    { _id: 'Toyota Camry', trips: 45 },
    { _id: 'Honda Accord', trips: 38 },
    { _id: 'BMW X5', trips: 32 },
    { _id: 'Mercedes E-Class', trips: 28 }
  ]);
  const [topRoutes, setTopRoutes] = useState<any[]>([
    { route: 'Airport to Downtown', count: 67 },
    { route: 'Hotel to City Center', count: 54 },
    { route: 'Train Station to Mall', count: 43 }
  ]);
  const [monthlyBookings, setMonthlyBookings] = useState<any[]>([
    { month: 'Jan', bookings: 28 },
    { month: 'Feb', bookings: 35 },
    { month: 'Mar', bookings: 42 },
    { month: 'Apr', bookings: 38 }
  ]);

  // Redirect if not admin (only chibaroshan23@gmail.com)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = user.email;
    
    if (userEmail !== 'chibaroshan23@gmail.com') {
      console.log('Access denied: User email is not chibaroshan23@gmail.com');
      navigate('/');
    }
  }, [navigate]);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://teambrothers.onrender.com/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data.data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://teambrothers.onrender.com/api/analytics/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    const fetchVehicleUsage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://teambrothers.onrender.com/api/analytics/vehicle-usage', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setVehicleUsage(data.data);
        }
      } catch (error) {
        console.error('Error fetching vehicle usage:', error);
      }
    };

    const fetchTopRoutes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://teambrothers.onrender.com/api/analytics/top-routes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setTopRoutes(data.data);
        }
      } catch (error) {
        console.error('Error fetching top routes:', error);
      }
    };

    const fetchMonthlyBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://teambrothers.onrender.com/api/analytics/monthly-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setMonthlyBookings(data.data);
        }
      } catch (error) {
        console.error('Error fetching monthly bookings:', error);
      }
    };

    if (isAdmin) {
      fetchBookings();
      fetchAnalytics();
      fetchVehicleUsage();
      fetchTopRoutes();
      fetchMonthlyBookings();
    }
  }, [isAdmin]);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Find the booking to get vehicle info
      const booking = bookings.find(b => b._id === bookingId);
      
      const response = await fetch(`https://teambrothers.onrender.com/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(prev =>
          prev.map(b =>
            b._id === bookingId ? { ...b, status: updatedBooking.data.status } : b
          )
        );

        // If booking is approved, make the vehicle unavailable
        if (status === 'approved' && booking) {
          try {
            console.log('Approving booking:', booking);
            console.log('Vehicle ID from booking:', booking.vehicleId);
            console.log('Vehicle name from booking:', booking.vehicleName);
            
            const vehicleResponse = await fetch(`https://teambrothers.onrender.com/api/vehicles/${booking.vehicleId}/availability`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ available: false }),
            });

            console.log('Vehicle API response status:', vehicleResponse.status);
            
            if (vehicleResponse.ok) {
              const vehicleData = await vehicleResponse.json();
              console.log('Vehicle API response:', vehicleData);
              
              // Update vehicle availability in the context
              toggleVehicleAvailability(booking.vehicleId);
              console.log(`Vehicle ${booking.vehicleName} marked as unavailable`);
            } else {
              const errorData = await vehicleResponse.json();
              console.error('Vehicle API error:', errorData);
            }
          } catch (error) {
            console.error('Error updating vehicle availability:', error);
          }
        }
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // View trip details
  const viewTripDetails = (booking: any) => {
    console.log('Opening trip details for booking:', booking);
    setSelectedBooking(booking);
    setIsModalOpen(true);
    
    // Auto-refresh booking data to get latest feedback
    setTimeout(() => {
      refreshBookingData(booking._id);
    }, 500);
  };

  // Refresh booking data to get latest feedback
  const refreshBookingData = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://teambrothers.onrender.com/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        console.log('Updated booking data:', updatedBooking.data);
        
        // Update the selected booking with fresh data
        setSelectedBooking(updatedBooking.data);
        
        // Also update the booking in the list
        setBookings(prev =>
          prev.map(b =>
            b._id === bookingId ? updatedBooking.data : b
          )
        );
      }
    } catch (error) {
      console.error('Error refreshing booking data:', error);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage vehicles, view enquiries, and track analytics
          </p>
        </div>

        {/* Analytics Cards */}
        {analyticsData && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalVehicles}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.activeVehicles}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalEnquiries}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.completedTrips}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(analyticsData.totalRevenue || 0).toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.avgRating}/5</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {(vehicleUsage.length > 0 || monthlyBookings.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Analytics Charts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Usage Chart */}
              {vehicleUsage.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={vehicleUsage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="trips" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
              
              {/* Monthly Bookings Chart */}
              {monthlyBookings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyBookings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Top Routes */}
        {topRoutes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Top Routes</h2>
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRoutes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{route.route}</p>
                          <p className="text-sm text-muted-foreground">{route.trips} trips</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(route.revenue || 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Management */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicles.map(vehicle => (
                  <div 
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-12 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.capacity} seats</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVehicleAvailability(vehicle.id)}
                      className={cn(
                        "gap-2",
                        vehicle.available ? "text-success" : "text-destructive"
                      )}
                    >
                      {vehicle.available ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                      <span className="text-xs">
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enquiries Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading enquiries...</p>
                </div>
              ) : bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Trip</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.slice(0, 10).map(booking => {
                        const statusInfo = statusConfig[booking.status] || {
                          label: booking.status,
                          color: 'bg-gray-500 text-white',
                          icon: Clock
                        };
                        const StatusIcon = statusInfo.icon;
                        return (
                          <TableRow key={booking._id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.customerName}</p>
                                <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{booking.vehicleName}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {tripTypeLabels[booking.tripType]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{booking.pickupDate}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">₹{(booking.estimatedCost || 0).toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={(v) => updateBookingStatus(booking._id, v as BookingStatus)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue>
                                    <Badge className={statusInfo.color}>
                                      {statusInfo.label}
                                    </Badge>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.keys(statusConfig) as BookingStatus[]).map(status => (
                                    <SelectItem key={status} value={status}>
                                      <Badge className={statusConfig[status].color}>
                                        {statusConfig[status].label}
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewTripDetails(booking)}
                                className="text-primary hover:text-primary/80"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No enquiries yet</p>
                  <p className="text-sm text-muted-foreground">
                    Bookings will appear here as customers submit enquiries
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      {/* Trip Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Trip Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedBooking.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedBooking.customerPhone}</p>
                    </div>
                  </div>
                  {selectedBooking.customerEmail && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedBooking.customerEmail}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Badge className={statusConfig[selectedBooking.status].color}>
                        {statusConfig[selectedBooking.status].label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{statusConfig[selectedBooking.status].label}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Trip Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Location</p>
                        <p className="font-medium">{selectedBooking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Drop Location</p>
                        <p className="font-medium">{selectedBooking.dropLocation}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Date</p>
                        <p className="font-medium">{selectedBooking.pickupDate}</p>
                      </div>
                    </div>
                    {selectedBooking.returnDate && selectedBooking.returnDate !== selectedBooking.pickupDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Return Date</p>
                          <p className="font-medium">{selectedBooking.returnDate}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Time</p>
                        <p className="font-medium">{selectedBooking.pickupTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{selectedBooking.vehicleName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trip Type</p>
                        <p className="font-medium">{tripTypeLabels[selectedBooking.tripType]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Cost Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Cost</p>
                      <p className="font-medium text-lg">₹{(selectedBooking.estimatedCost || 0)?.toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedBooking.distance && (
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-medium">{selectedBooking.distance} km</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Notes
                  </h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Customer Feedback */}
              {selectedBooking.feedback && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Customer Feedback
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refreshBookingData(selectedBooking._id)}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {/* Feedback Text */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        "{selectedBooking.feedback}"
                      </p>
                    </div>
                    
                    {/* Feedback Date */}
                    {selectedBooking.feedbackDate && (
                      <div className="text-xs text-muted-foreground">
                        Submitted on: {new Date(selectedBooking.feedbackDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Feedback Message */}
              {selectedBooking.status === 'completed' && !selectedBooking.feedback && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Customer Feedback
                  </h3>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500 italic">
                      No feedback submitted yet for this completed trip.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default Admin;
