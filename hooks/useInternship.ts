import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { internshipsApi } from '@/lib/api-client';

// Query hook for fetching internships
export const useInternships = (filters?: {
  page?: number;
  limit?: number;
  location?: string;
  isRemote?: boolean;
}) => {
  return useQuery({
    queryKey: ['internships', filters],
    queryFn: () => internshipsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hook for creating internships
export const useCreateInternship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internshipsApi.create,
    onSuccess: () => {
      // Invalidate and refetch internships
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    },
  });
};

