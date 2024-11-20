import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJob } from '../lib/api/jobs';
import { useNavigate } from 'react-router-dom';

export function useUpdateJob(jobId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateJob>[1]) => updateJob(jobId, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', jobId] });
      navigate('/employer/jobs');
    }
  });
} 