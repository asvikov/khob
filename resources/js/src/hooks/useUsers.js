import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';


export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient('/users');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useUser = (userId, options = {}) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await apiClient(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCreateUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      window.location.replace('/admin/users');
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useUpdateUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await apiClient(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch specific user and users list
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      window.location.replace('/admin/users');
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useDeleteUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await apiClient(`/users/${userId}`, {
        method: 'DELETE',
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      window.location.replace('/admin/users');
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useUsersForRegister = (us_name = '', options = {}) => {
  return useQuery({
    queryKey: ['usersforregister', us_name],
    queryFn: async ({ queryKey }) => {
      const [, name] = queryKey;
      const response = await apiClient('/forregisterusers', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
    enabled: !!us_name && us_name.length > 2,
    //refetchOnMount: true, рефетч при монтировании
    //refetchOnWindowFocus: true, рефетч при фокусе окна
    ...options,
  });
}