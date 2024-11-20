import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJobStatus } from '../lib/api/jobs';

export function useUpdateJobStatus(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'active' | 'inactive') => updateJobStatus(jobId, status),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', jobId] });
    }
  });
} 