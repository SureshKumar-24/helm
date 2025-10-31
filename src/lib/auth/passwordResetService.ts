/**
 * Password Reset Service
 * Handles all password reset operations
 */

import apiClient from '../api/client';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  reset_token: string;
  expires_in: number;
}

export interface ResetPasswordRequest {
  reset_token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Request password reset - sends OTP to email
 */
export async function requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
  try {
    const response = await apiClient.post<ForgotPasswordResponse>(
      '/api/v1/auth/forgot-password',
      { email }
    );
    return response.data;
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error(error.response.data?.detail || 'Too many password reset attempts. Please try again later.');
    }
    
    if (error.response?.status === 422) {
      const detail = error.response.data?.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        throw new Error(detail[0].msg || 'Invalid email format');
      }
      throw new Error('Invalid email format');
    }
    
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    
    throw new Error('Failed to request password reset. Please check your connection and try again.');
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
  try {
    const response = await apiClient.post<VerifyOTPResponse>(
      '/api/v1/auth/verify-otp',
      { email, otp }
    );
    return response.data;
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.detail || 'Invalid or expired OTP');
    }
    
    if (error.response?.status === 422) {
      const detail = error.response.data?.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        throw new Error(detail[0].msg || 'Invalid OTP format');
      }
      throw new Error('Invalid OTP format');
    }
    
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    
    throw new Error('Failed to verify OTP. Please check your connection and try again.');
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(resetToken: string, newPassword: string): Promise<ResetPasswordResponse> {
  try {
    const response = await apiClient.post<ResetPasswordResponse>(
      '/api/v1/auth/reset-password',
      {
        reset_token: resetToken,
        new_password: newPassword,
      }
    );
    return response.data;
  } catch (error: any) {
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error(error.response.data?.detail || 'Reset token has expired. Please request a new password reset.');
    }
    
    if (error.response?.status === 422) {
      const detail = error.response.data?.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        throw new Error(detail[0].msg || 'Invalid password format');
      }
      if (typeof detail === 'string') {
        throw new Error(detail);
      }
      throw new Error('Invalid password format');
    }
    
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    
    throw new Error('Failed to reset password. Please check your connection and try again.');
  }
}

export const passwordResetService = {
  requestPasswordReset,
  verifyOTP,
  resetPassword,
};
