import React, { useState, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

interface VehicleAvailabilityCalendarProps {
  vehicleId: string;
  onDateSelect: (pickupDate: Date, returnDate: Date) => void;
  selectedDates?: { pickup: Date; return: Date } | null;
  className?: string;
}

interface BookedDate {
  pickupDate: string;
  returnDate: string;
}

export const VehicleAvailabilityCalendar: React.FC<VehicleAvailabilityCalendarProps> = ({
  vehicleId,
  onDateSelect,
  selectedDates,
  className
}) => {
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ from: Date | null; to: Date | null }>({
    from: selectedDates?.pickup || null,
    to: selectedDates?.return || null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookedDates = useCallback(async () => {
    try {
      setLoading(true);
      
      // For now, use mock data since API endpoint doesn't exist
      // TODO: Implement backend API endpoint: /api/availability/booked-dates/${vehicleId}
      const mockBookedDates = [
        {
          pickupDate: '2024-01-15',
          returnDate: '2024-01-17'
        },
        {
          pickupDate: '2024-01-25',
          returnDate: '2024-01-27'
        }
      ];
      
      setBookedDates(mockBookedDates);
      setError(null);
      
      // Uncomment when backend API is ready:
      // const response = await fetch(`http://localhost:5000/api/availability/booked-dates/${vehicleId}`);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data = await response.json();
      // if (data.success) {
      //   setBookedDates(data.bookedDates);
      // } else {
      //   setError('Failed to load availability');
      // }
    } catch (err) {
      console.error('Error fetching booked dates:', err);
      setError('Error loading availability');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchBookedDates();
  }, [fetchBookedDates]);

  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(booking => {
      const pickup = parseISO(booking.pickupDate);
      const returnDate = parseISO(booking.returnDate);
      return isWithinInterval(date, { start: pickup, end: returnDate }) ||
             isSameDay(date, pickup) ||
             isSameDay(date, returnDate);
    });
  };

  const isDateDisabled = (date: Date): boolean => {
    // Disable dates before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    
    // Disable booked dates
    return isDateBooked(date);
  };

  const handleSelect = (range: { from?: Date; to?: Date }) => {
    if (!range.from) return;

    const newRange = {
      from: range.from || null,
      to: range.to || null
    };

    setSelectedRange(newRange);

    if (newRange.from && newRange.to) {
      onDateSelect(newRange.from, newRange.to);
    }
  };

  const modifiers = {
    booked: isDateBooked,
    disabled: isDateDisabled
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      cursor: 'not-allowed'
    },
    disabled: {
      color: '#d1d5db',
      cursor: 'not-allowed'
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <Button onClick={fetchBookedDates} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Rental Dates</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          numberOfMonths={2}
          className="mx-auto"
          styles={{
            root: { margin: '0 auto' },
            months: { display: 'flex', gap: '1rem' },
            month: { flex: 1 }
          }}
        />
      </div>

      {selectedRange.from && selectedRange.to && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <CalendarIcon className="h-5 w-5" />
            <div>
              <p className="font-medium">Selected Dates</p>
              <p className="text-sm">
                {format(selectedRange.from, 'MMM dd, yyyy')} - {format(selectedRange.to, 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>• Red dates are already booked</p>
        <p>• Select your pickup and return dates</p>
        <p>• Minimum rental period: 1 day</p>
      </div>
    </div>
  );
};

export default VehicleAvailabilityCalendar;
