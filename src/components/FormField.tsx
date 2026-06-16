import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useFormValidation, FormFieldProps, formatValidationMessage } from '../hooks/useFormValidation';

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  required = false,
  disabled = false,
  type = 'text',
  error,
  touched,
  showError = true,
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  }, [showPassword]);

  const hasError = showError && touched && error;
  const isValid = touched && !error && value.length > 0;

  const getInputClasses = () => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-app-bg text-app-text placeholder-app-text-muted';
    const focusClasses = isFocused ? 'border-neon-cyan shadow-lg shadow-neon-cyan/20' : 'border-app-border';
    const errorClasses = hasError ? 'border-red-500 shadow-lg shadow-red-500/20' : '';
    const validClasses = isValid ? 'border-green-500 shadow-lg shadow-green-500/20' : '';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text';

    return `${baseClasses} ${focusClasses} ${errorClasses} ${validClasses} ${disabledClasses} ${inputClassName}`;
  };

  const getLabelClasses = () => {
    const baseClasses = 'block text-sm font-medium mb-2 transition-colors duration-200';
    const focusClasses = isFocused ? 'text-neon-cyan' : 'text-app-text';
    const errorClasses = hasError ? 'text-red-500' : '';
    const requiredClasses = required ? 'after:content[" *"] after:text-red-500 after:ml-1' : '';

    return `${baseClasses} ${focusClasses} ${errorClasses} ${requiredClasses} ${labelClassName}`;
  };

  const getErrorClasses = () => {
    const baseClasses = 'mt-2 flex items-center gap-2 text-sm transition-all duration-200';
    const errorClasses = hasError ? 'text-red-500 opacity-100' : 'opacity-0';

    return `${baseClasses} ${errorClasses} ${errorClassName}`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className={getLabelClasses()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Input */}
        <motion.input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={getInputClasses()}
          whileFocus={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <motion.button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-app-text-muted hover:text-app-text transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.div
                  key="hide"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeOff size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="show"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* Validation Icons */}
        {touched && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hasError ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : isValid ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : null}
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            className={getErrorClasses()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Count (for text inputs with maxLength) */}
      {type === 'text' && (
        <div className="absolute bottom-2 right-2 text-xs text-app-text-muted">
          {value.length}
        </div>
      )}
    </div>
  );
};

export default FormField;
