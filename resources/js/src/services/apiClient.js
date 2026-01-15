import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from './authService';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Export the apiClient function so it can be used in other hooks
export { apiClient };

const getAuthToken = () => {
  const user = authService.getUser();
  if (user.bearer_token) {
    return user.bearer_token;
  }
  return null;
};

// Base API client function
const apiClient = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      ...options.headers,
    },
    ...options,
  };

  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, config);

  console.log('qApiClient');


  // Handle 401 Unauthorized
  if (response.status === 401) {
    authService.logout();
    window.location.replace('/login');
    throw new Error('Unauthorized: Please log in again');
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Forbidden: You do not have permission to access this resource');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  // Handle validation errors (422) and other successful responses
  if (response.ok || response.status === 422) {
    const data = await response.json();
    
    if (data.errors) {
      //console.error('API Errors:', data.errors);
      const errorMessage = Object.values(data.errors).flat().join('; ');
      const error = new Error(errorMessage || 'Validation failed');
      error.status = response.status;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }
    
    return {
      data,
      status: response.status,
    };
  }

  // For other error statuses
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
};

// Generic GET hook
export const useGetQuery = (queryKey, endpoint, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: () => apiClient(endpoint),
    ...options,
  });
};

// Generic POST hook
export const usePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ endpoint, data }) => 
      apiClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries();
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Generic PUT hook
export const usePutMutation = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ endpoint, data }) => 
      apiClient(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Generic DELETE hook
export const useDeleteMutation = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (endpoint) => 
      apiClient(endpoint, {
        method: 'DELETE',
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
