import React, { useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

interface AnalogTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}

const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({
  isOpen,
  onClose,
  onTimeSelect,
  initialTime = ''
}) => {
  const [time, setTime] = useState(() => {
    if (initialTime) {
      const [hour, minute] = initialTime.split(':');
      const date = new Date();
      date.setHours(parseInt(hour));
      date.setMinutes(parseInt(minute));
      return date;
    }
    return new Date();
  });

  const handleConfirm = () => {
    const hour24 = time.getHours();
    const hour12 = hour24 % 12 || 12;
    const minute = time.getMinutes().toString().padStart(2, '0');
    const period = hour24 >= 12 ? 'PM' : 'AM';
    
    const formatted = `${hour12}:${minute} ${period}`;
    const time24 = `${hour24.toString().padStart(2, '0')}:${minute}`;
    
    onTimeSelect(time24);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const hour24 = time.getHours();
  const hour12 = hour24 % 12 || 12;
  const minute = time.getMinutes().toString().padStart(2, '0');
  const period = hour24 >= 12 ? 'PM' : 'AM';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-full mx-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Set Time</h2>
        </div>

        {/* Clock */}
        <div className="flex justify-center mb-4">
          <Clock 
            value={time} 
            onChange={setTime}
            size={180}
          />
        </div>

        {/* Time Selectors */}
        <div className="flex justify-center gap-2 mb-4">
          {/* Hour Selector */}
          <select
            className="border border-gray-300 rounded px-3 py-2 text-center font-medium focus:border-blue-500 focus:outline-none"
            value={hour12}
            onChange={(e) => {
              const newDate = new Date(time);
              let h = parseInt(e.target.value);
              if (period === 'PM' && h < 12) h += 12;
              if (period === 'AM' && h === 12) h = 0;
              newDate.setHours(h);
              setTime(newDate);
            }}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Minute Selector */}
          <select
            className="border border-gray-300 rounded px-3 py-2 text-center font-medium focus:border-blue-500 focus:outline-none"
            value={minute}
            onChange={(e) => {
              const newDate = new Date(time);
              newDate.setMinutes(Number(e.target.value));
              setTime(newDate);
            }}
          >
            {[...Array(60)].map((_, i) => (
              <option key={i} value={i.toString().padStart(2, '0')}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>

          {/* AM/PM Selector */}
          <select
            className="border border-gray-300 rounded px-3 py-2 text-center font-medium focus:border-blue-500 focus:outline-none"
            value={period}
            onChange={(e) => {
              const newDate = new Date(time);
              let h = newDate.getHours();
              if (e.target.value === 'AM' && h >= 12) h -= 12;
              if (e.target.value === 'PM' && h < 12) h += 12;
              newDate.setHours(h);
              setTime(newDate);
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Set Time
          </button>
          <button
            onClick={handleCancel}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimePicker;
