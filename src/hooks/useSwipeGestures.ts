import { useState, useEffect, useRef, useCallback } from 'react';

interface SwipeGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  preventDefault?: boolean;
  touchOnly?: boolean;
  mouseOnly?: boolean;
  longPressDelay?: number;
  swipeVelocity?: number;
  swipeDistance?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGestures = (options: SwipeGesturesOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    threshold = 50,
    preventDefault = true,
    touchOnly = false,
    mouseOnly = false,
    longPressDelay = 500,
    swipeVelocity = 0.3,
    swipeDistance = 100
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent | MouseEvent) => {
    if (!elementRef.current) return;
    
    const isTouchEvent = 'touches' in e;
    const isMouseEvent = 'button' in e;
    
    // Check if this event type should be handled
    if (touchOnly && !isTouchEvent) return;
    if (mouseOnly && !isMouseEvent) return;

    if (preventDefault) {
      e.preventDefault();
    }

    let clientX: number, clientY: number;
    
    if (isTouchEvent) {
      const touch = (e as TouchEvent).touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const point: TouchPoint = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };

    touchStartRef.current = point;
    touchEndRef.current = point;
    setIsSwiping(false);
    setSwipeDirection(null);

    // Start long press timer
    if (onLongPress) {
      setIsLongPressing(false);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true);
        onLongPress();
      }, longPressDelay);
    }
  }, [preventDefault, touchOnly, mouseOnly, onLongPress, longPressDelay]);

  const handleTouchMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!touchStartRef.current || !elementRef.current) return;

    const isTouchEvent = 'touches' in e;
    
    if (touchOnly && !isTouchEvent) return;
    if (mouseOnly && !isTouchEvent) return;

    if (preventDefault) {
      e.preventDefault();
    }

    let clientX: number, clientY: number;
    
    if (isTouchEvent) {
      const touch = (e as TouchEvent).touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const currentPoint: TouchPoint = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };

    touchEndRef.current = currentPoint;

    // Check if movement is significant enough to be considered a swipe
    const deltaX = currentPoint.x - touchStartRef.current.x;
    const deltaY = currentPoint.y - touchStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > threshold) {
      setIsSwiping(true);
      // Cancel long press if movement is detected
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
        setIsLongPressing(false);
      }
    }
  }, [preventDefault, touchOnly, mouseOnly, threshold]);

  const handleTouchEnd = useCallback((e: TouchEvent | MouseEvent) => {
    if (!touchStartRef.current || !touchEndRef.current || !elementRef.current) return;

    const isTouchEvent = 'touches' in e;
    
    if (touchOnly && !isTouchEvent) return;
    if (mouseOnly && !isTouchEvent) return;

    if (preventDefault) {
      e.preventDefault();
    }

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Determine if it's a tap or swipe
    if (distance < threshold) {
      // It's a tap
      if (onTap) {
        onTap();
      }
    } else if (velocity > swipeVelocity && distance > swipeDistance) {
      // It's a swipe
      setIsSwiping(true);
      
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          setSwipeDirection('right');
          if (onSwipeRight) onSwipeRight();
        } else {
          setSwipeDirection('left');
          if (onSwipeLeft) onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          setSwipeDirection('down');
          if (onSwipeDown) onSwipeDown();
        } else {
          setSwipeDirection('up');
          if (onSwipeUp) onSwipeUp();
        }
      }
    }

    // Reset long press state
    setIsLongPressing(false);

    // Reset touch points
    touchStartRef.current = null;
    touchEndRef.current = null;

    // Reset swipe state after animation
    setTimeout(() => {
      setIsSwiping(false);
      setSwipeDirection(null);
    }, 300);
  }, [preventDefault, touchOnly, mouseOnly, threshold, swipeVelocity, swipeDistance, onTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const eventOptions = { passive: !preventDefault };

    // Touch events
    if (!mouseOnly) {
      element.addEventListener('touchstart', handleTouchStart as EventListener, eventOptions);
      element.addEventListener('touchmove', handleTouchMove as EventListener, eventOptions);
      element.addEventListener('touchend', handleTouchEnd as EventListener, eventOptions);
    }

    // Mouse events
    if (!touchOnly) {
      element.addEventListener('mousedown', handleTouchStart as EventListener, eventOptions);
      element.addEventListener('mousemove', handleTouchMove as EventListener, eventOptions);
      element.addEventListener('mouseup', handleTouchEnd as EventListener, eventOptions);
    }

    return () => {
      if (!mouseOnly) {
        element.removeEventListener('touchstart', handleTouchStart as EventListener);
        element.removeEventListener('touchmove', handleTouchMove as EventListener);
        element.removeEventListener('touchend', handleTouchEnd as EventListener);
      }

      if (!touchOnly) {
        element.removeEventListener('mousedown', handleTouchStart as EventListener);
        element.removeEventListener('mousemove', handleTouchMove as EventListener);
        element.removeEventListener('mouseup', handleTouchEnd as EventListener);
      }

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault, touchOnly, mouseOnly]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    elementRef,
    isSwiping,
    swipeDirection,
    isLongPressing,
    reset: () => {
      touchStartRef.current = null;
      touchEndRef.current = null;
      setIsSwiping(false);
      setSwipeDirection(null);
      setIsLongPressing(false);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };
};

// Hook for carousel swipe navigation
export const useCarouselSwipe = (
  itemCount: number,
  currentIndex: number,
  onIndexChange: (index: number) => void,
  options: Partial<SwipeGesturesOptions> = {}
) => {
  const {
    onSwipeLeft = () => {
      const prevIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
      onIndexChange(prevIndex);
    },
    onSwipeRight = () => {
      const nextIndex = currentIndex === itemCount - 1 ? 0 : currentIndex + 1;
      onIndexChange(nextIndex);
    },
    threshold = 50,
    swipeVelocity = 0.3,
    swipeDistance = 100
  } = options;

  return useSwipeGestures({
    onSwipeLeft,
    onSwipeRight,
    threshold,
    swipeVelocity,
    swipeDistance,
    ...options
  });
};

// Hook for detecting device capabilities
export const useTouchCapabilities = () => {
  const [hasTouch, setHasTouch] = useState(false);
  const [maxTouchPoints, setMaxTouchPoints] = useState(0);

  useEffect(() => {
    setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setMaxTouchPoints(navigator.maxTouchPoints || 0);
  }, []);

  return {
    hasTouch,
    maxTouchPoints,
    isTouchDevice: hasTouch || maxTouchPoints > 0,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
};
