import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onHome?: () => void;
  onWork?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
  onSearch?: () => void;
  onThemeToggle?: () => void;
  onMenuToggle?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    onHome,
    onWork,
    onAbout,
    onContact,
    onSearch,
    onThemeToggle,
    onMenuToggle,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onSpace,
    onTab,
    onShiftTab,
    enabled = true,
    preventDefault = true
  } = options;

  const isInputFocused = () => {
    const tag = document.activeElement?.tagName || '';
    const isEditable = document.activeElement?.getAttribute('contenteditable') === 'true';
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable;
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key, ctrlKey, metaKey, altKey, shiftKey } = event;

    // Don't intercept single keys when typing in an input
    if (isInputFocused() && !ctrlKey && !metaKey && !altKey && key !== 'Escape' && key !== 'Tab') {
      return;
    }

    // Global shortcuts
    if (ctrlKey || metaKey) {
      switch (key) {
        case 'k':
          event.preventDefault();
          onSearch?.();
          break;
        case '/':
          event.preventDefault();
          onSearch?.();
          break;
        case 't':
          event.preventDefault();
          onThemeToggle?.();
          break;
        case 'm':
          event.preventDefault();
          onMenuToggle?.();
          break;
      }
      return;
    }

    // Alt key combinations
    if (altKey) {
      switch (key) {
        case 'h':
          event.preventDefault();
          onHome?.();
          break;
        case 'w':
          event.preventDefault();
          onWork?.();
          break;
        case 'a':
          event.preventDefault();
          onAbout?.();
          break;
        case 'c':
          event.preventDefault();
          onContact?.();
          break;
      }
      return;
    }

    // Single key shortcuts
    switch (key) {
      case 'Escape':
        if (preventDefault) event.preventDefault();
        onEscape?.();
        break;
      case 'ArrowUp':
        if (preventDefault) event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        if (preventDefault) event.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        if (preventDefault) event.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        if (preventDefault) event.preventDefault();
        onArrowRight?.();
        break;
      case 'Enter':
        onEnter?.();
        break;
      case ' ':
        if (preventDefault) event.preventDefault();
        onSpace?.();
        break;
      case 'Tab':
        if (shiftKey) {
          if (preventDefault) event.preventDefault();
          onShiftTab?.();
        } else {
          onTab?.();
        }
        break;
      case 'h':
        if (!altKey && !ctrlKey && !metaKey) {
          if (preventDefault) event.preventDefault();
          onHome?.();
        }
        break;
      case 'w':
        if (!altKey && !ctrlKey && !metaKey) {
          if (preventDefault) event.preventDefault();
          onWork?.();
        }
        break;
      case 'a':
        if (!altKey && !ctrlKey && !metaKey) {
          if (preventDefault) event.preventDefault();
          onAbout?.();
        }
        break;
      case 'c':
        if (!altKey && !ctrlKey && !metaKey) {
          if (preventDefault) event.preventDefault();
          onContact?.();
        }
        break;
    }
  }, [
    enabled,
    preventDefault,
    onHome,
    onWork,
    onAbout,
    onContact,
    onSearch,
    onThemeToggle,
    onMenuToggle,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onSpace,
    onTab,
    onShiftTab
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  return {
    // Helper functions for focus management
    focusNext: (selector: string) => {
      const focusableElements = document.querySelectorAll(selector);
      const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      (focusableElements[nextIndex] as HTMLElement)?.focus();
    },
    focusPrevious: (selector: string) => {
      const focusableElements = document.querySelectorAll(selector);
      const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
      const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
      (focusableElements[prevIndex] as HTMLElement)?.focus();
    },
    focusFirst: (selector: string) => {
      const firstElement = document.querySelector(selector) as HTMLElement;
      firstElement?.focus();
    },
    focusLast: (selector: string) => {
      const focusableElements = document.querySelectorAll(selector);
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      lastElement?.focus();
    }
  };
};

// Helper function to get all focusable elements
export const getFocusableElements = (container: Element = document.body): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

// Helper function to trap focus within a container
export const trapFocus = (container: Element) => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: Event) => {
    const keyboardEvent = e as KeyboardEvent;
    if (keyboardEvent.key !== 'Tab') return;

    if (keyboardEvent.shiftKey) {
      if (document.activeElement === firstElement) {
        keyboardEvent.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        keyboardEvent.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

// Hook for focus trap management
export const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const cleanup = trapFocus(containerRef.current);
    
    // Focus first element when trap is activated
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    return cleanup;
  }, [isActive, containerRef]);
};
