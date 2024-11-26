import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitApplication } from '../lib/api/applications';
import { toast } from 'react-hot-toast';

export function useSubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application submitted successfully');
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  });
} 