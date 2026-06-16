import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'switch';
  showLabel?: boolean;
  position?: 'fixed' | 'static';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  showLabel = false,
  position = 'static',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    setTheme,
    toggleTheme,
    cycleTheme,
    getThemeIcon,
    getThemeLabel,
    isDark,
    isLight,
    isSystem,
    isTransitioning
  } = useDarkMode({
    defaultTheme: 'dark',
    storageKey: 'portfolio-theme',
    enableSystem: true,
    transitionDuration: 300
  });

  const themes = [
    { value: 'dark' as const, label: 'Dark Mode', icon: Moon, description: 'Dark theme for night viewing' },
    { value: 'light' as const, label: 'Light Mode', icon: Sun, description: 'Light theme for day viewing' },
    { value: 'system' as const, label: 'System Theme', icon: Monitor, description: 'Follow system preference' }
  ];

  const handleThemeSelect = (selectedTheme: typeof theme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  const renderButton = () => (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-3 rounded-lg border transition-all ${
        isTransitioning
          ? 'border-app-border bg-card-bg'
          : isDark
          ? 'border-neon-cyan/50 bg-neon-cyan/10 hover:border-neon-cyan hover:bg-neon-cyan/20'
          : 'border-neon-purple/50 bg-neon-purple/10 hover:border-neon-purple hover:bg-neon-purple/20'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Current theme: ${getThemeLabel()}. Click to toggle theme.`}
      title={`Theme: ${getThemeLabel()} (Ctrl+T to toggle)`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5"
        >
          {theme === 'dark' && <Moon size={20} />}
          {theme === 'light' && <Sun size={20} />}
          {theme === 'system' && <Monitor size={20} />}
        </motion.div>
      </AnimatePresence>

      {isTransitioning && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-neon-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, repeat: 1 }}
        />
      )}

      {showLabel && (
        <span className="ml-2 text-xs text-app-text uppercase tracking-wider">{getThemeLabel()}</span>
      )}
    </motion.button>
  );

  const renderDropdown = () => (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          isOpen
            ? 'border-neon-cyan bg-neon-cyan/10'
            : 'border-app-border bg-card-bg hover:border-app-border/80'
        } ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Theme selector. Current: ${getThemeLabel()}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {theme === 'dark' && <Moon size={20} />}
          {theme === 'light' && <Sun size={20} />}
          {theme === 'system' && <Monitor size={20} />}
        </div>
        <span className="text-xs text-app-text uppercase tracking-wider">{getThemeLabel()}</span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card-bg border border-app-border rounded-lg shadow-xl z-50 overflow-hidden"
            role="listbox"
          >
            <div className="p-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;

                return (
                  <motion.button
                    key={themeOption.value}
                    onClick={() => handleThemeSelect(themeOption.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                      isSelected
                        ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan'
                        : 'hover:bg-app-border/30 border border-transparent text-app-text'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <Icon size={16} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{themeOption.label}</div>
                      <div className="text-xs text-app-text-muted">{themeOption.description}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="px-3 py-2 border-t border-app-border bg-app-bg/50">
              <div className="text-xs text-app-text-muted">
                <div className="flex items-center justify-between">
                  <span>Keyboard shortcuts:</span>
                  <span>Ctrl+T to toggle</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderSwitch = () => (
    <motion.button
      onClick={() => toggleTheme()}
      className={`relative w-16 h-8 rounded-full transition-all ${
        isDark
          ? 'bg-neon-cyan/20 border border-neon-cyan/50'
          : 'bg-neon-purple/20 border border-neon-purple/50'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Toggle theme. Currently ${getThemeLabel()}`}
      role="switch"
      aria-checked={isDark}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 32 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {isDark ? <Moon size={12} className="text-neon-cyan" /> : <Sun size={12} className="text-neon-purple" />}
        </div>
      </motion.div>

      {isTransitioning && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-neon-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, repeat: 1 }}
        />
      )}
    </motion.button>
  );

  const renderContent = () => {
    switch (variant) {
      case 'dropdown':
        return renderDropdown();
      case 'switch':
        return renderSwitch();
      default:
        return renderButton();
    }
  };

  if (position === 'fixed') {
    return (
      <div className="fixed top-6 right-6 z-40">{renderContent()}</div>
    );
  }

  return renderContent();
};

export default ThemeToggle;

