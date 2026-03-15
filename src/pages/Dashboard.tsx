import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  IndianRupee, 
  X,
  Check,
  AlertCircle,
  Car,
  Star,
  Trophy,
  Award,
  Coins
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  bookingId: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tripType: string;
  passengers: number;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  distance: number;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, user not authenticated');
        setBookings([]);
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/bookings/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
      } else {
        console.error('API Error:', data.message);
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Please login to view your bookings",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to load bookings",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserBookings();
    }
  }, [isAuthenticated, user, fetchUserBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully",
        });
        
        // Update local state
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to cancel booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const icons = {
      pending: <AlertCircle className="w-3 h-3" />,
      approved: <Check className="w-3 h-3" />,
      confirmed: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
      completed: <Check className="w-3 h-3" />,
      cancelled: <X className="w-3 h-3" />,
    };

    return (
      <Badge className={`flex items-center gap-1 ${variants[status as keyof typeof variants] || variants.pending}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-muted-foreground">You need to be logged in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your bookings and profile information</p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Role: {user.role || 'User'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Member since: {format(new Date(user?.createdAt || Date.now()), 'MMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Bookings: {bookings.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Rewards & Loyalty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier Badge */}
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                <div className="flex justify-center mb-2">
                  {user?.tier === 'gold' && <Award className="w-8 h-8 text-yellow-600" />}
                  {user?.tier === 'silver' && <Trophy className="w-8 h-8 text-gray-400" />}
                  {user?.tier === 'bronze' && <Star className="w-8 h-8 text-orange-600" />}
                </div>
                <div className="text-2xl font-bold capitalize mb-1">{user?.tier || 'Bronze'}</div>
                <div className="text-sm text-muted-foreground">Member Tier</div>
              </div>

              {/* Reward Points */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Coins className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold mb-1">{user?.rewardPoints || 0}</div>
                <div className="text-sm text-muted-foreground">Reward Points</div>
              </div>

              {/* Total Trips */}
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Car className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold mb-1">{user?.totalBookings || 0}</div>
                <div className="text-sm text-muted-foreground">Completed Trips</div>
              </div>
            </div>

            {/* Progress to Next Tier */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress to {user?.tier === 'gold' ? 'Max Level' : user?.tier === 'silver' ? 'Gold' : 'Silver'}</span>
                <span className="text-sm text-muted-foreground">
                  {user?.tier === 'gold' ? '500+ points' : 
                   user?.tier === 'silver' ? `${500 - (user?.rewardPoints || 0)} points to Gold` : 
                   `${200 - (user?.rewardPoints || 0)} points to Silver`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: user?.tier === 'gold' ? '100%' : 
                           user?.tier === 'silver' ? `${Math.min(((user?.rewardPoints || 0) - 200) / 3, 100)}%` :
                           `${Math.min(((user?.rewardPoints || 0) / 200) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-4">
              <h4 className="font-medium mb-3">Your Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user?.tier === 'bronze' ? 'bg-orange-500' :
                    user?.tier === 'silver' ? 'bg-gray-400' : 'bg-yellow-500'
                  }`} />
                  <span className="text-muted-foreground">
                    {user?.tier === 'bronze' ? '50 points per trip' :
                     user?.tier === 'silver' ? '75 points per trip' : '100 points per trip'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user?.tier === 'bronze' ? 'bg-orange-500' :
                    user?.tier === 'silver' ? 'bg-gray-400' : 'bg-yellow-500'
                  }`} />
                  <span className="text-muted-foreground">
                    {user?.tier === 'bronze' ? 'Standard support' :
                     user?.tier === 'silver' ? 'Priority support' : 'VIP support'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user?.tier === 'bronze' ? 'bg-orange-500' :
                    user?.tier === 'silver' ? 'bg-gray-400' : 'bg-yellow-500'
                  }`} />
                  <span className="text-muted-foreground">
                    {user?.tier === 'bronze' ? 'Basic rewards' :
                     user?.tier === 'silver' ? 'Enhanced rewards' : 'Premium rewards'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
                <Button onClick={() => window.location.href = '/booking'}>
                  Make a Booking
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.vehicleName}</h3>
                            <p className="text-sm text-muted-foreground">Booking ID: {booking.bookingId}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.pickupLocation} → {booking.dropLocation}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {format(new Date(booking.pickupDate), 'MMM dd, yyyy')} - {format(new Date(booking.returnDate), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.pickupTime}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.passengers} passengers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.estimatedCost.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Distance:</span>
                              <span>{booking.distance} km</span>
                            </div>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-3 p-2 bg-muted rounded text-sm">
                            <strong>Notes:</strong> {booking.notes}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:ml-4">
                        {booking.status === 'pending' || booking.status === 'approved' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                          </Button>
                        ) : null}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/contact`}
                        >
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
