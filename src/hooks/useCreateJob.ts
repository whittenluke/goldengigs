import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '../lib/api/jobs';
import { useNavigate } from 'react-router-dom';

export function useCreateJob() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // Invalidate jobs list cache
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      // Redirect to jobs management page
      navigate('/employer/jobs');
    }
  });
} 