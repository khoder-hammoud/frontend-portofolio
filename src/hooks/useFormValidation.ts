import { useState, useCallback, useEffect } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  custom?: (value: string) => string | null;
}

interface ValidationField {
  name: string;
  value: string;
  rules: ValidationRule;
  label?: string;
}

interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface FormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrors?: boolean;
  errorStyle?: 'inline' | 'tooltip' | 'summary';
  debounceMs?: number;
}

export const useFormValidation = (options: FormValidationOptions = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    showErrors = true,
    errorStyle = 'inline',
    debounceMs = 300
  } = options;

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateField = useCallback((field: ValidationField): string | null => {
    const { value, rules, name } = field;

    // Required validation
    if (rules.required && (!value || value.trim() === '')) {
      return `${field.label || name} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Length validations
    if (rules.minLength && value.length < rules.minLength) {
      return `${field.label || name} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${field.label || name} must be no more than ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${field.label || name} format is invalid`;
    }

    // Email validation
    if (rules.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return `${field.label || name} must be a valid email address`;
      }
    }

    // URL validation
    if (rules.url) {
      try {
        new URL(value);
      } catch {
        return `${field.label || name} must be a valid URL`;
      }
    }

    // Phone validation
    if (rules.phone) {
      const phonePattern = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phonePattern.test(value.replace(/\s/g, ''))) {
        return `${field.label || name} must be a valid phone number`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, []);

  // Validate entire form
  const validateForm = useCallback((fields: ValidationField[]): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    fields.forEach(field => {
      const error = validateField(field);
      if (error) {
        newErrors.push({
          field: field.name,
          message: error,
          type: 'error'
        });
      }
    });

    setErrors(newErrors);
    setIsValid(newErrors.length === 0);
    return newErrors;
  }, [validateField]);

  // Clear errors for a field
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => prev.filter(error => error.field !== fieldName));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setIsValid(true);
    setTouched(new Set());
  }, []);

  // Get field error
  const getFieldError = useCallback((fieldName: string) => {
    return errors.find(error => error.field === fieldName);
  }, [errors]);

  // Check if field is valid
  const isFieldValid = useCallback((fieldName: string) => {
    return !errors.some(error => error.field === fieldName);
  }, [errors]);

  // Mark field as touched
  const markFieldTouched = useCallback((fieldName: string) => {
    setTouched(prev => new Set(prev).add(fieldName));
  }, []);

  // Check if form should show errors
  const shouldShowErrors = useCallback((fieldName?: string) => {
    if (!showErrors) return false;
    if (fieldName) {
      return touched.has(fieldName) && getFieldError(fieldName) !== undefined;
    }
    return touched.size > 0 && errors.length > 0;
  }, [showErrors, touched, getFieldError]);

  return {
    errors,
    touched,
    isValid,
    isSubmitting,
    validateField,
    validateForm,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    isFieldValid,
    shouldShowErrors,
    markFieldTouched,
    setIsSubmitting
  };
};

// Common validation rules
export const validationRules = {
  required: (message?: string) => ({ required: true, custom: () => message || 'This field is required' }),
  minLength: (length: number, message?: string) => ({
    minLength: length,
    custom: () => message || `Must be at least ${length} characters`
  }),
  maxLength: (length: number, message?: string) => ({
    maxLength: length,
    custom: () => message || `Must be no more than ${length} characters`
  }),
  email: (message?: string) => ({ email: true, custom: () => message || 'Must be a valid email address' }),
  url: (message?: string) => ({ url: true, custom: () => message || 'Must be a valid URL' }),
  phone: (message?: string) => ({ phone: true, custom: () => message || 'Must be a valid phone number' }),
  pattern: (pattern: RegExp, message?: string) => ({
    pattern,
    custom: () => message || 'Format is invalid'
  }),
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    custom: () => 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    custom: () => 'Name can only contain letters, spaces, hyphens, and apostrophes'
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    custom: () => 'Username can only contain letters, numbers, underscores, and hyphens'
  }
};

// Form field component props
export interface FormFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  error?: string;
  touched?: boolean;
  showError?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

// Validation result formatter
// NOTE: This file is TS-only (no JSX). Keep formatter as string builder.
export const formatValidationMessage = (
  error: ValidationError,
  style: 'inline' | 'tooltip' | 'summary'
): string => {
  switch (style) {
    case 'inline':
      return error.message;
    case 'tooltip':
      return `⚠️ ${error.message}`;
    case 'summary':
      return `⚠️ ${error.field}: ${error.message}`;
    default:
      return error.message;
  }
};

