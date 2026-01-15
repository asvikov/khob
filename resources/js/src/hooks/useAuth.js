import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import authService from '../services/authService';


export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials) => {
      authService.logout();
      const response = await apiClient('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response?.data === 'failure') {
        throw new Error('логин или пароль не верные');
      }

      if (!authService.setUserFromResponse(response)) {
        throw new Error('ошибка данных пользователя');
      }
      return response;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate all queries to refetch with new auth state
        //maby all cache will better than ['user', data.data.user.id]
        queryClient.invalidateQueries();
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      window.location.replace('/users');
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useRegister = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData) => {
      authService.logout();
      const response = await apiClient('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (!authService.setUserFromResponse(response)) {
        throw new Error('ошибка данных пользователя');
      }
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      window.location.replace('/users');
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useLogout = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient('/logout', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      authService.logout();
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      window.location.replace('/login');
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};