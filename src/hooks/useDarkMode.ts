import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface DarkModeOptions {
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  transitionDuration?: number;
}

export const useDarkMode = (options: DarkModeOptions = {}) => {
  const {
    defaultTheme = 'dark',
    storageKey = 'portfolio-theme',
    enableSystem = true,
    transitionDuration = 300
  } = options;

  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored && ['dark', 'light'].includes(stored)) {
      return stored;
    }
    
    // Check system preference if enabled
    if (enableSystem && window.matchMedia) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    
    return defaultTheme;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme switching
    if (isTransitioning) {
      root.style.transition = `background-color ${transitionDuration}ms ease, color ${transitionDuration}ms ease`;
    } else {
      root.style.transition = '';
    }

    // Apply theme classes
    root.classList.remove('dark', 'light', 'system');
    
    if (theme === 'system' && enableSystem) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
      root.classList.add('system');
    } else {
      root.classList.add(theme);
    }

    // Set theme color meta tag
    const themeColor = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }, [theme, isTransitioning, transitionDuration, enableSystem]);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      root.classList.add(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem]);

  const setTheme = (newTheme: Theme) => {
    setIsTransitioning(true);
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  };

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme(enableSystem ? 'system' : 'dark');
    } else {
      setTheme('dark');
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = enableSystem ? ['dark', 'light', 'system'] : ['dark', 'light'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const resetToSystem = () => {
    if (enableSystem) {
      setTheme('system');
    }
  };

  const getEffectiveTheme = (): 'dark' | 'light' => {
    if (theme === 'system' && enableSystem) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme as 'dark' | 'light';
  };

  const getThemeIcon = () => {
    const effectiveTheme = getEffectiveTheme();
    switch (theme) {
      case 'dark':
        return 'moon';
      case 'light':
        return 'sun';
      case 'system':
        return effectiveTheme === 'dark' ? 'moon' : 'sun';
      default:
        return 'moon';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark Mode';
      case 'light':
        return 'Light Mode';
      case 'system':
        return 'System Theme';
      default:
        return 'Dark Mode';
    }
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    cycleTheme,
    resetToSystem,
    getEffectiveTheme,
    getThemeIcon,
    getThemeLabel,
    isTransitioning,
    isDark: getEffectiveTheme() === 'dark',
    isLight: getEffectiveTheme() === 'light',
    isSystem: theme === 'system'
  };
};

// Theme preference detection hook
export const useSystemThemePreference = () => {
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateSystemTheme = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Initial detection
    updateSystemTheme({ matches: mediaQuery.matches } as MediaQueryListEvent);
    
    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemTheme);
    
    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  return systemTheme;
};

// Theme animation hook
export const useThemeAnimation = (trigger: boolean, duration: number = 300) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return isAnimating;
};
