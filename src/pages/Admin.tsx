import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Car, FileText, BarChart3, 
  CheckCircle, Clock, XCircle, Users, TrendingUp,
  ToggleLeft, ToggleRight, Eye
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
  approved: { label: 'Approved', color: 'bg-success text-success-foreground', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive text-destructive-foreground', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-primary text-primary-foreground', icon: CheckCircle },
};

const Admin = () => {
  const navigate = useNavigate();
  const { 
    isAdmin, 
    vehicles, 
    toggleVehicleAvailability, 
    getAnalytics 
  } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/bookings', {
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

    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
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
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (!isAdmin) return null;

  // Calculate analytics from fetched bookings
  const analytics = {
    totalEnquiries: bookings.length,
    pendingEnquiries: bookings.filter(b => b.status === 'pending').length,
    approvedEnquiries: bookings.filter(b => b.status === 'approved').length,
    mostRequestedVehicle: (() => {
      const vehicleRequests: Record<string, number> = {};
      bookings.forEach(b => {
        vehicleRequests[b.vehicleName] = (vehicleRequests[b.vehicleName] || 0) + 1;
      });
      
      let mostRequested = null;
      Object.entries(vehicleRequests).forEach(([name, count]) => {
        if (!mostRequested || count > mostRequested.count) {
          mostRequested = { name, count };
        }
      });
      return mostRequested;
    })(),
    tripTypeDistribution: (() => {
      const distribution: Record<string, number> = {};
      bookings.forEach(b => {
        distribution[b.tripType] = (distribution[b.tripType] || 0) + 1;
      });
      return distribution;
    })(),
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Enquiries</p>
                  <p className="font-heading text-3xl font-bold">{analytics.totalEnquiries}</p>
                </div>
                <FileText className="w-10 h-10 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="font-heading text-3xl font-bold text-warning">{analytics.pendingEnquiries}</p>
                </div>
                <Clock className="w-10 h-10 text-warning/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="font-heading text-3xl font-bold text-success">{analytics.approvedEnquiries}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-success/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Most Requested</p>
                  <p className="font-heading text-lg font-bold truncate">
                    {analytics.mostRequestedVehicle?.name || 'N/A'}
                  </p>
                  {analytics.mostRequestedVehicle && (
                    <p className="text-xs text-muted-foreground">
                      {analytics.mostRequestedVehicle.count} requests
                    </p>
                  )}
                </div>
                <TrendingUp className="w-10 h-10 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.slice(0, 10).map(booking => {
                        const StatusIcon = statusConfig[booking.status].icon;
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
                              <p className="font-medium">₹{booking.estimatedCost.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={(v) => updateBookingStatus(booking._id, v as BookingStatus)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue>
                                    <Badge className={statusConfig[booking.status].color}>
                                      {statusConfig[booking.status].label}
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

        {/* Trip Type Distribution */}
        {Object.keys(analytics.tripTypeDistribution).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Trip Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {Object.entries(analytics.tripTypeDistribution).map(([type, count]) => (
                  <div 
                    key={type}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent"
                  >
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{tripTypeLabels[type as keyof typeof tripTypeLabels]}</p>
                      <p className="text-sm text-muted-foreground">{count} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;
