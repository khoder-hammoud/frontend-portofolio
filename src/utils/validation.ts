// Input Validation Utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate input against rules
 */
export const validateInput = (
  value: string,
  rules: ValidationRule
): ValidationResult => {
  const errors: string[] = [];

  // Required check
  if (rules.required && !value.trim()) {
    errors.push(rules.message || 'This field is required');
    return { isValid: false, errors };
  }

  // Skip other checks if empty and not required
  if (!value.trim() && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // Min length
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  // Max length
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.message || 'Invalid format');
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    errors.push(rules.message || 'Validation failed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Common validation rules
 */
export const ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name should only contain letters and spaces'
  },
  
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'Message should be between 10 and 1000 characters'
  },
  
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL'
  },
  
  phone: {
    pattern: /^\+?[\d\s-()]+$/,
    message: 'Please enter a valid phone number'
  }
};

/**
 * Validate form data
 */
export const validateForm = (
  data: Record<string, string>,
  rules: Record<string, ValidationRule>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};
  
  Object.keys(rules).forEach(field => {
    results[field] = validateInput(data[field] || '', rules[field]);
  });
  
  return results;
};

/**
 * Check if form is valid
 */
export const isFormValid = (
  results: Record<string, ValidationResult>
): boolean => {
  return Object.values(results).every(result => result.isValid);
};
