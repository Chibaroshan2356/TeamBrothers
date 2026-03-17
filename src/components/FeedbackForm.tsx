import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useToastHelpers } from '@/components/ui/saas-toast';

interface FeedbackFormProps {
  bookingId?: string;
  onSubmit?: (feedback: any) => void;
  showRating?: boolean;
  showServiceType?: boolean;
}

export function FeedbackForm({ 
  bookingId, 
  onSubmit, 
  showRating = true, 
  showServiceType = true 
}: FeedbackFormProps) {
  const { success: showSuccess, error: showError } = useToastHelpers();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState('vehicle-rental');
  const [feedbackType, setFeedbackType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      showError('Rating Required', 'Please select a rating before submitting');
      return;
    }
    
    if (!comment.trim()) {
      showError('Comment Required', 'Please provide your feedback comment');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const feedbackData = {
        bookingId,
        userId: user.id,
        rating,
        comment: comment.trim(),
        serviceType,
        feedbackType
      };
      
      const response = await fetch('https://teambrothers.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Feedback Submitted', 'Thank you for your valuable feedback!');
        setComment('');
        setRating(0);
        setServiceType('vehicle-rental');
        setFeedbackType('general');
        
        if (onSubmit) {
          onSubmit(data.data);
        }
      } else {
        showError('Submission Failed', data.message || 'Failed to submit feedback');
      }
      
    } catch (error) {
      showError('Network Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : star <= hoveredStar 
                ? 'text-yellow-300 fill-yellow-300'
                : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Share Your Feedback
        </h2>
        <p className="text-gray-600">
          Your feedback helps us improve our service and provide better experiences for everyone.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {showRating && (
          <div>
            <Label className="text-base font-medium mb-3 block">Rating *</Label>
            <div className="flex items-center gap-3">
              {renderStars()}
              <span className="text-sm text-gray-600 ml-2">
                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        )}

        {showServiceType && (
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="vehicle-rental">Vehicle Rental</option>
              <option value="customer-service">Customer Service</option>
              <option value="booking-process">Booking Process</option>
              <option value="vehicle-quality">Vehicle Quality</option>
              <option value="general">General</option>
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="feedbackType">Feedback Category</Label>
          <select
            id="feedbackType"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="general">General Feedback</option>
            <option value="complaint">Complaint</option>
            <option value="suggestion">Suggestion</option>
            <option value="compliment">Compliment</option>
            <option value="issue">Report Issue</option>
          </select>
        </div>

        <div>
          <Label htmlFor="comment">Your Feedback *</Label>
          <Textarea
            id="comment"
            placeholder="Share your experience, suggestions, or concerns..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send size={18} />
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
}
