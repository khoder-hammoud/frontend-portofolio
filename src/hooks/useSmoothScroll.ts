import { useEffect, useCallback } from 'react';

export const useSmoothScroll = () => {
  // Enhanced smooth scroll with easing
  const scrollToElement = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to top with animation
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Scroll to specific position
  const scrollToPosition = useCallback((y: number) => {
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }, []);

  // Enhanced scroll with easing function
  const smoothScrollTo = useCallback((targetY: number, duration: number = 800) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easeProgress = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * easeProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Prevent scroll bounce on mobile
  const preventScrollBounce = useCallback(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      if (scrollTop === 0) {
        e.preventDefault();
        window.scrollTo(0, 1);
      } else if (scrollTop + clientHeight >= scrollHeight) {
        e.preventDefault();
        window.scrollTo(0, scrollHeight - clientHeight - 1);
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Add smooth scroll behavior to anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.slice(1);
        if (targetId) {
          scrollToElement(targetId, 80); // 80px offset for header
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [scrollToElement]);

  // Add parallax scroll effect
  const addParallaxEffect = useCallback((element: HTMLElement, speed: number = 0.5) => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToPosition,
    smoothScrollTo,
    preventScrollBounce,
    addParallaxEffect
  };
};
