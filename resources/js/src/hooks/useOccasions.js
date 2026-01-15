import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';


export const useOccasions = (location, user_id, options = {}) => {
  let url = '/occasions';
  let query_key = [];

  if(user_id) {
    
    if(location === '/occasions') {
      url = '/occasions?occ=own';
      query_key = ['occasionsown', user_id];
    } else {
      url = '/occasions';
      query_key = ['occasionsall', user_id];
    }
  } else {
    url = '/welcome';
    query_key = ['welcome'];
  }

  return useQuery({
    queryKey: query_key,
    queryFn: async () => {
      const response = await apiClient(url);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useOccasion = (occasionId, options = {}) => {
  return useQuery({
    queryKey: ['occasion', occasionId],
    queryFn: async () => {
      const response = await apiClient(`/occasions/${occasionId}`);
      return response.data;
    },
    enabled: !!occasionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCreateOccasion = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (occasionData) => {
      const response = await apiClient('/occasions', {
        method: 'POST',
        body: JSON.stringify(occasionData),
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch occasions list
      queryClient.invalidateQueries({ queryKey: ['occasionsown'] });
      queryClient.invalidateQueries({ queryKey: ['occasionsall'] });
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

export const useUpdateOccasion = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ occasionId, occasionData }) => {
      const response = await apiClient(`/occasions/${occasionId}`, {
        method: 'PUT',
        body: JSON.stringify(occasionData),
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch specific occasion and occasions list
      queryClient.invalidateQueries({ queryKey: ['occasion', variables.occasionId] });
      queryClient.invalidateQueries({ queryKey: ['occasionsown'] });
      queryClient.invalidateQueries({ queryKey: ['occasionsall'] });
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

export const useDeleteOccasion = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (occasionId) => {
      const response = await apiClient(`/occasions/${occasionId}`, {
        method: 'DELETE',
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch occasions list
      queryClient.invalidateQueries({ queryKey: ['occasionsown'] });
      queryClient.invalidateQueries({ queryKey: ['occasionsall'] });
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