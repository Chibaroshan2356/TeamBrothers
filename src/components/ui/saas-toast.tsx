import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const icons = {
    success: <span className="mt-1 text-emerald-500 text-lg">✅</span>,
    error: <span className="mt-1 text-red-500 text-lg">⚠️</span>,
    warning: <span className="mt-1 text-amber-500 text-lg">⚠️</span>,
    info: <span className="mt-1 text-blue-500 text-lg">ℹ️</span>,
  };
  return icons[type];
};

const getUnderlineColor = (type: ToastType) => {
  const colors = {
    success: 'bg-emerald-200',
    error: 'bg-red-200',
    warning: 'bg-amber-200',
    info: 'bg-blue-200',
  };
  return colors[type];
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.persistent) return;

    const interval = 50;
    const decrement = (100 / duration) * interval;
    
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          onRemove(toast.id);
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [toast.id, toast.persistent, duration, onRemove]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const typeStyles = {
    success: 'relative overflow-hidden flex items-start gap-3 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200',
    error: 'relative overflow-hidden flex items-start gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-200',
    warning: 'relative overflow-hidden flex items-start gap-3 px-5 py-4 rounded-xl bg-amber-50 border border-amber-200',
    info: 'relative overflow-hidden flex items-start gap-3 px-5 py-4 rounded-xl bg-blue-50 border border-blue-200',
  };

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        typeStyles[toast.type],
        isVisible 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"
      )}
      style={{
        minWidth: '300px',
        maxWidth: '380px',
      }}
    >
      {/* Icon */}
      <ToastIcon type={toast.type} />
      
      {/* Text */}
      <div className="flex-1">
        <p className={`font-semibold ${toast.type === 'error' ? 'text-red-700' : toast.type === 'success' ? 'text-emerald-700' : toast.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={`text-sm ${toast.type === 'error' ? 'text-red-600' : toast.type === 'success' ? 'text-emerald-600' : toast.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`}>
            {toast.message}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className={`text-red-400 hover:text-red-600 transition-colors duration-200`}
      >
        ✕
      </button>

      {/* Animated line */}
      <div
        className={`
          absolute bottom-0 left-0
          h-[3px] w-full
          ${getUnderlineColor(toast.type)}
        `}
      >
        <div className="h-full bg-red-400 animate-progress" />
      </div>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Convenience hooks for different toast types
export const useToastHelpers = () => {
  const { addToast, removeToast, clearAll } = useToast();

  return {
    success: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'success', title, message, ...options }),
    
    error: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'error', title, message, ...options }),
    
    warning: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'info', title, message, ...options }),
    
    remove: removeToast,
    clearAll,
  };
};
