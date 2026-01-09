import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ValidationError {
  field: string;
  message: string;
  fieldName?: string;
}

interface ValidationPopup {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message?: string;
  errors?: ValidationError[];
  duration?: number;
  persistent?: boolean;
  highlightedFields?: string[];
}

interface ValidationContextType {
  showValidation: (popup: Omit<ValidationPopup, 'id'>) => string;
  clearValidation: (id: string) => void;
  clearAll: () => void;
  highlightField: (fieldId: string) => void;
  clearHighlights: () => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

const ValidationIcon = ({ type }: { type: ValidationPopup['type'] }) => {
  const icons = {
    error: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  };
  return icons[type];
};

const ValidationPopupItem = ({ 
  popup, 
  onRemove, 
  onHighlightField 
}: { 
  popup: ValidationPopup; 
  onRemove: (id: string) => void;
  onHighlightField: (fieldId: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const duration = popup.duration ?? 6000;

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (popup.persistent) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(popup.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [popup.id, popup.persistent, duration, onRemove]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(popup.id), 300);
  };

  const handleFieldClick = (fieldId: string) => {
    onHighlightField(fieldId);
    // Scroll to field if needed
    const element = document.getElementById(fieldId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  const typeStyles = {
    error: 'bg-amber-50/95 border-amber-200/70 text-amber-900',
    warning: 'bg-amber-50/95 border-amber-200/70 text-amber-900',
    info: 'bg-blue-50/95 border-blue-200/70 text-blue-900',
    success: 'bg-emerald-50/95 border-emerald-200/70 text-emerald-900',
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg backdrop-blur-sm border shadow-sm transition-all duration-300 ease-out max-w-md",
        typeStyles[popup.type],
        isVisible 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"
      )}
    >
      <ValidationIcon type={popup.type} />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold leading-tight mb-1">{popup.title}</h4>
        {popup.message && (
          <p className="text-sm opacity-80 leading-relaxed mb-2">{popup.message}</p>
        )}
        
        {popup.errors && popup.errors.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium opacity-70">Please check the following:</p>
            <ul className="space-y-1">
              {popup.errors.map((error, index) => (
                <li key={index} className="text-xs flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <button
                    onClick={() => handleFieldClick(error.field)}
                    className="text-left hover:underline transition-colors duration-200"
                  >
                    <span className="font-medium">{error.fieldName || error.field}:</span> {error.message}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 rounded-md hover:bg-black/5 transition-colors duration-200"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
};

export const ValidationContainer = () => {
  const { popups, removeValidation, highlightField } = useValidation();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto max-h-screen overflow-y-auto">
        {popups.map((popup) => (
          <ValidationPopupItem 
            key={popup.id} 
            popup={popup} 
            onRemove={removeValidation}
            onHighlightField={highlightField}
          />
        ))}
      </div>
    </div>
  );
};

export const ValidationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popups, setPopups] = useState<ValidationPopup[]>([]);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

  const showValidation = useCallback((popup: Omit<ValidationPopup, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newPopup: ValidationPopup = { ...popup, id };
    
    setPopups(prev => [...prev, newPopup]);
    
    // Highlight fields if specified
    if (popup.highlightedFields) {
      setHighlightedFields(new Set(popup.highlightedFields));
      popup.highlightedFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
          element.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2');
        }
      });
    }
    
    // Auto-remove after duration if not persistent
    if (!popup.persistent && popup.duration !== 0) {
      setTimeout(() => {
        removeValidation(id);
      }, popup.duration ?? 6000);
    }
    
    return id;
  }, []);

  const removeValidation = useCallback((id: string) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
    // Clear highlights when popup is removed
    clearHighlights();
  }, []);

  const clearAll = useCallback(() => {
    setPopups([]);
    clearHighlights();
  }, []);

  const highlightField = useCallback((fieldId: string) => {
    // Clear previous highlights
    clearHighlights();
    
    // Highlight new field
    const element = document.getElementById(fieldId);
    if (element) {
      element.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-background');
      element.focus();
      setHighlightedFields(new Set([fieldId]));
    }
  }, []);

  const clearHighlights = useCallback(() => {
    highlightedFields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-background');
      }
    });
    setHighlightedFields(new Set());
  }, [highlightedFields]);

  return (
    <ValidationContext.Provider value={{ 
      showValidation, 
      clearValidation: removeValidation, 
      clearAll, 
      highlightField, 
      clearHighlights 
    }}>
      {children}
      <ValidationContainer />
    </ValidationContext.Provider>
  );
};

// Convenience hooks for different validation types
export const useValidationHelpers = () => {
  const { showValidation, clearAll, highlightField, clearHighlights } = useValidation();

  return {
    showError: (title: string, message?: string, errors?: ValidationError[], options?: Partial<Omit<ValidationPopup, 'id' | 'type' | 'title' | 'message' | 'errors'>>) =>
      showValidation({ type: 'error', title, message, errors, ...options }),
    
    showWarning: (title: string, message?: string, errors?: ValidationError[], options?: Partial<Omit<ValidationPopup, 'id' | 'type' | 'title' | 'message' | 'errors'>>) =>
      showValidation({ type: 'warning', title, message, errors, ...options }),
    
    showInfo: (title: string, message?: string, options?: Partial<Omit<ValidationPopup, 'id' | 'type' | 'title' | 'message'>>) =>
      showValidation({ type: 'info', title, message, ...options }),
    
    showSuccess: (title: string, message?: string, options?: Partial<Omit<ValidationPopup, 'id' | 'type' | 'title' | 'message'>>) =>
      showValidation({ type: 'success', title, message, ...options }),
    
    highlightField,
    clearHighlights,
    clearAll,
  };
};
