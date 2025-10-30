/**
 * Validation Utilities
 * Frontend validation for authentication forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate password requirements
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password || password.length === 0) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate password match
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = [];
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check password strength and provide feedback
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;
  
  if (!password || password.length === 0) {
    return { score: 0, feedback: ['Enter a password'] };
  }
  
  // Check length
  if (password.length < 8) {
    feedback.push('Use at least 8 characters');
    return { score: 0, feedback };
  }
  
  // Base score for meeting minimum requirements
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (hasUppercase && hasLowercase && hasNumber) {
    score = 1; // Weak - meets minimum
    feedback.push('Add special characters for stronger password');
  }
  
  // Fair - has special character
  if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
    score = 2;
    feedback.push('Use more characters for better security');
  }
  
  // Good - longer password
  if (password.length >= 12 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
    score = 3;
    feedback.push('Strong password!');
  }
  
  // Strong - very long password
  if (password.length >= 16 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
    score = 4;
    feedback.push('Excellent password!');
  }
  
  // If doesn't meet minimum requirements
  if (score === 0) {
    if (!hasUppercase) feedback.push('Add uppercase letters');
    if (!hasLowercase) feedback.push('Add lowercase letters');
    if (!hasNumber) feedback.push('Add numbers');
  }
  
  return { score, feedback };
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[score] || 'Very Weak';
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  return colors[score] || '#ef4444';
}
