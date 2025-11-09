import { toast } from 'sonner';

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  toast.error('Something went wrong. Please try again.');
  event.preventDefault();
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  toast.error('An unexpected error occurred.');
});

// Utility function for handling async operations with error handling
export const handleAsync = async <T>(
  operation: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    toast.error(errorMessage);
    return null;
  }
};

// API error handler
export const handleApiError = (error: any, customMessage?: string) => {
  const message = customMessage || 
    error?.message || 
    'Network error. Please check your connection.';
  
  console.error('API Error:', error);
  toast.error(message);
};

// Form validation helper
export const validateRequired = (value: string, fieldName: string): boolean => {
  if (!value || value.trim() === '') {
    toast.error(`${fieldName} is required`);
    return false;
  }
  return true;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('Please enter a valid email address');
    return false;
  }
  return true;
};