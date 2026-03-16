import React, { useState, useEffect } from 'react';
import { Clock, X, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  onClose,
  onTimeSelect,
  initialTime = ''
}) => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Initialize with initial time if provided
  useEffect(() => {
    if (initialTime) {
      const [h, m] = initialTime.split(':');
      const hourNum = parseInt(h);
      setPeriod(hourNum >= 12 ? 'PM' : 'AM');
      setHour(hourNum > 12 ? (hourNum - 12).toString() : hourNum === 0 ? '12' : hourNum.toString());
      setMinute(m);
    }
  }, [initialTime]);

  const handleHourChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 12)) {
      setHour(value);
    }
  };

  const handleMinuteChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 0 && num <= 59)) {
      setMinute(value.padStart(2, '0'));
    }
  };

  const incrementHour = () => {
    const current = parseInt(hour) || 12;
    const next = current >= 12 ? 1 : current + 1;
    setHour(next.toString());
  };

  const decrementHour = () => {
    const current = parseInt(hour) || 12;
    const prev = current <= 1 ? 12 : current - 1;
    setHour(prev.toString());
  };

  const incrementMinute = () => {
    const current = parseInt(minute) || 0;
    const next = current >= 59 ? 0 : current + 1;
    setMinute(next.toString().padStart(2, '0'));
  };

  const decrementMinute = () => {
    const current = parseInt(minute) || 0;
    const prev = current <= 0 ? 59 : current - 1;
    setMinute(prev.toString().padStart(2, '0'));
  };

  const handleOK = () => {
    if (hour && minute) {
      const hour24 = period === 'PM' && hour !== '12' 
        ? (parseInt(hour) + 12).toString()
        : period === 'AM' && hour === '12' 
        ? '00'
        : hour.padStart(2, '0');
      
      const timeString = `${hour24}:${minute.padStart(2, '0')}`;
      console.log('Modal sending time:', timeString); // Debug log
      onTimeSelect(timeString);
    } else {
      // If no time selected, close modal without updating
      onClose();
    }
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">ENTER TIME</h2>
        </div>

        {/* Time Input Section */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Hour Input */}
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={hour}
              onChange={(e) => handleHourChange(e.target.value)}
              className="w-20 h-20 text-3xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              maxLength={2}
              placeholder="12"
            />
            <span className="text-xs text-gray-500 mt-2">Hour</span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={incrementHour}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Increment hour"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={decrementHour}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Decrement hour"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Colon Separator */}
          <div className="text-3xl font-bold text-gray-400">:</div>

          {/* Minute Input */}
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={minute}
              onChange={(e) => handleMinuteChange(e.target.value)}
              className="w-20 h-20 text-3xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              maxLength={2}
              placeholder="00"
            />
            <span className="text-xs text-gray-500 mt-2">Minute</span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={incrementMinute}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Increment minute"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={decrementMinute}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Decrement minute"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AM/PM Toggle */}
          <div className="ml-4 flex flex-col">
            <button
              onClick={() => setPeriod('AM')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                period === 'AM'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod('PM')}
              className={`px-4 py-2 text-sm font-medium rounded-b-lg transition-colors ${
                period === 'PM'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          {/* Clock Icon */}
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOK}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;
