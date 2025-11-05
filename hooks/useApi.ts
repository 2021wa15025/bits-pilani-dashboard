import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiOptions {
  immediate?: boolean; // Whether to call the API immediately
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      if (mountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      
      if (mountedRef.current) {
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
      
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, reset };
}

// Specialized hook for data fetching with caching
export function useFetch<T = any>(
  url: string | null,
  options: RequestInit & { 
    immediate?: boolean;
    cacheKey?: string;
    cacheDuration?: number; // in milliseconds
  } = {}
): UseApiReturn<T> {
  const { immediate = true, cacheKey, cacheDuration = 5 * 60 * 1000, ...fetchOptions } = options;
  
  const cache = useRef(new Map());
  
  const fetchData = useCallback(async (): Promise<T> => {
    if (!url) {
      throw new Error('URL is required');
    }

    // Check cache if cacheKey is provided
    if (cacheKey) {
      const cached = cache.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        return cached.data;
      }
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result if cacheKey is provided
    if (cacheKey) {
      cache.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
  }, [url, cacheKey, cacheDuration, fetchOptions]);

  return useApi<T>(fetchData, { immediate: immediate && !!url });
}

// Hook for handling form submissions
export function useFormSubmit<T = any>(
  submitFunction: (formData: any) => Promise<T>
) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submit = useCallback(async (formData: any): Promise<T | null> => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      const result = await submitFunction(formData);
      setSubmitSuccess(true);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      setSubmitError(errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [submitFunction]);

  const reset = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitting(false);
  }, []);

  return {
    submit,
    submitting,
    submitError,
    submitSuccess,
    reset,
  };
}