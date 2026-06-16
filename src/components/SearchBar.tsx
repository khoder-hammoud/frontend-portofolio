import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  isLoading?: boolean;
  resultCount?: number;
  showShortcuts?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = 'SEARCH...',
  suggestions = [],
  onSuggestionClick,
  isLoading = false,
  resultCount,
  showShortcuts = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || !showSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
            onSuggestionClick?.(suggestions[selectedSuggestionIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, showSuggestions, suggestions, selectedSuggestionIndex, onSuggestionClick]);

  useEffect(() => {
    setShowSuggestions(isFocused && suggestions.length > 0 && value.length >= 2);
  }, [isFocused, suggestions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSelectedSuggestionIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    onSuggestionClick?.(suggestion);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center group">
        <Search 
          size={14} 
          className={`absolute left-4 transition-colors pointer-events-none ${
            isLoading ? 'text-neon-cyan animate-pulse' : 
            isFocused ? 'text-neon-cyan' : 'text-app-text-muted'
          }`} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-card-bg border border-app-border rounded-lg text-xs text-app-text uppercase tracking-widest focus:border-neon-cyan focus:ring-0 transition-all placeholder:text-app-text-muted/50 group-hover:border-app-border/80"
          aria-label={`Search projects. ${showShortcuts ? 'Press Ctrl+K to focus' : ''}`}
          autoComplete="off"
        />
        
        {showShortcuts && !isFocused && (
          <div className="absolute right-4 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[8px] bg-app-border/50 rounded text-app-text-muted">
              <Command size={8} />
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[8px] bg-app-border/50 rounded text-app-text-muted">
              K
            </kbd>
          </div>
        )}
        
        {value && !isLoading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-4 text-app-text-muted hover:text-app-text transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </motion.button>
        )}

        {resultCount !== undefined && value && (
          <div className="absolute -bottom-6 left-0 text-[10px] text-app-text-muted">
            {resultCount === 0 ? 'No results found' : `${resultCount} result${resultCount !== 1 ? 's' : ''}`}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card-bg border border-app-border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-2 text-left text-xs text-app-text hover:bg-app-border/30 transition-colors ${
                    index === selectedSuggestionIndex ? 'bg-app-border/50 text-neon-cyan' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{suggestion}</span>
                    {index === selectedSuggestionIndex && (
                      <kbd className="px-1 py-0.5 text-[8px] bg-neon-cyan/20 rounded text-neon-cyan">
                        Enter
                      </kbd>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="px-4 py-2 border-t border-app-border/50 text-[8px] text-app-text-muted">
              <div className="flex items-center justify-between">
                <span>Use ↑↓ to navigate</span>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
