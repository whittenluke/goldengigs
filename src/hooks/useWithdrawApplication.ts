import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawApplication } from '../lib/api/applications';
import { toast } from 'react-hot-toast';

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, reason }: { applicationId: string; reason?: string }) =>
      withdrawApplication(applicationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application withdrawn successfully');
    },
    onError: (error) => {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  });
} 