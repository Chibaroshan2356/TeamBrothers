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
  MessageSquare,
  Star
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
  const [feedbackBookingId, setFeedbackBookingId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  const handleSubmitFeedback = async () => {
    if (!feedbackBookingId || !feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please provide feedback text",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting feedback:', {
      bookingId: feedbackBookingId,
      feedback: feedbackText.trim(),
    });

    try {
      setSubmittingFeedback(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: feedbackBookingId,
          feedback: feedbackText.trim(),
        }),
      });

      console.log('Feedback response status:', response.status);
      
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }
      
      console.log('Feedback response data:', data);

      if (data.success) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback! It has been sent to admin.",
        });
        
        // Reset feedback form
        setFeedbackBookingId(null);
        setFeedbackText('');
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit feedback",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "Network Error",
          description: "Unable to connect to server. Please check your internet connection.",
          variant: "destructive",
        });
      } else if (error instanceof SyntaxError) {
        toast({
          title: "Server Error", 
          description: "Server is not responding correctly. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmittingFeedback(false);
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
        <div className="animate-spin rounded-full h-8 w-8"></div>
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
                        
                        {booking.status === 'completed' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setFeedbackBookingId(booking._id);
                              setFeedbackText('');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Leave Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackBookingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Leave Feedback</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your experience about this trip
            </p>
            
            <div className="space-y-4">
              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFeedbackBookingId(null);
                    setFeedbackText('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback || !feedbackText.trim()}
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
