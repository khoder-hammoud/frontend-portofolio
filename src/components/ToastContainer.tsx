import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastProps, ToastType, ToastAction } from './Toast';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: ToastAction;
  progress?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string, options?: Partial<Toast>) => void;
  error: (message: string, options?: Partial<Toast>) => void;
  warning: (message: string, options?: Partial<Toast>) => void;
  info: (message: string, options?: Partial<Toast>) => void;
  loading: (message: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  enableSound?: boolean;
  enableHaptics?: boolean;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5,
  position = 'top-right',
  enableSound = false,
  enableHaptics = true
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (enableSound && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [enableSound]);

  // Play sound effect
  const playSound = useCallback((type: ToastType) => {
    if (!enableSound || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    const frequencies = {
      success: 800,
      error: 300,
      warning: 600,
      info: 400,
      loading: 500
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  }, [enableSound]);

  // Play haptic feedback
  const playHaptic = useCallback(() => {
    if (!enableHaptics || !('vibrate' in navigator)) return;
    
    const patterns = {
      success: [10, 50, 10],
      error: [100, 50, 100],
      warning: [50, 30, 50],
      info: [20, 10, 20],
      loading: [10, 20, 10]
    };

    navigator.vibrate(patterns.success);
  }, [enableHaptics]);

  const generateId = useCallback(() => {
    return `toast-${++toastIdRef.current}-${Date.now()}`;
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      id: generateId(),
      duration: 5000,
      persistent: false,
      ...toast
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      
      if (updated.length > maxToasts) {
        return updated.slice(-maxToasts);
      }
      
      return updated;
    });

    playSound(newToast.type);
    playHaptic();

    if (!newToast.persistent) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, newToast.duration);
    }
  }, [maxToasts, playSound, playHaptic, generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        clearAllToasts();
      }
      
      if (e.key === 'Escape' && toasts.length > 0) {
        e.preventDefault();
        removeToast(toasts[toasts.length - 1].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toasts, removeToast, clearAllToasts]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success: (message, options) => addToast({ type: 'success', message, ...options }),
    error: (message, options) => addToast({ type: 'error', message, ...options }),
    warning: (message, options) => addToast({ type: 'warning', message, ...options }),
    info: (message, options) => addToast({ type: 'info', message, ...options }),
    loading: (message, options) => addToast({ type: 'loading', message, persistent: true, ...options })
  };

  // Container positioning
  const getContainerStyles = () => {
    const baseStyles = 'fixed z-50 pointer-events-none';
    
    switch (position) {
      case 'top-right':
        return `${baseStyles} top-4 right-4 flex flex-col items-end gap-2`;
      case 'top-left':
        return `${baseStyles} top-4 left-4 flex flex-col items-start gap-2`;
      case 'bottom-right':
        return `${baseStyles} bottom-4 right-4 flex flex-col items-end gap-2`;
      case 'bottom-left':
        return `${baseStyles} bottom-4 left-4 flex flex-col items-start gap-2`;
      case 'top-center':
        return `${baseStyles} top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2`;
      case 'bottom-center':
        return `${baseStyles} bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2`;
      default:
        return `${baseStyles} top-4 right-4 flex flex-col items-end gap-2`;
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className={getContainerStyles()}>
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Export convenience hook
export const useToast = () => {
  const context = useToastContext();
  return context;
};
