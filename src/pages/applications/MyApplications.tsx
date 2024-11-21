import { useQuery } from '@tanstack/react-query';
import { getMyApplications } from '../../lib/api/applications';
import { useWithdrawApplication } from '../../hooks/useWithdrawApplication';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useState } from 'react';

export function MyApplicationsPage() {
  const [withdrawalId, setWithdrawalId] = useState<string | null>(null);
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getMyApplications
  });

  const withdrawMutation = useWithdrawApplication();

  const handleWithdraw = async () => {
    if (!withdrawalId) return;
    
    await withdrawMutation.mutateAsync({
      applicationId: withdrawalId
    });
    setWithdrawalId(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Applications</h1>

      <div className="space-y-6">
        {applications?.map((application) => (
          <div
            key={application.id}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {application.job?.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {application.job?.employer_profiles.company_name}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Applied on: {new Date(application.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>

              {application.status === 'pending' && (
                <Button
                  variant="secondary"
                  onClick={() => setWithdrawalId(application.id)}
                >
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!withdrawalId}
        onClose={() => setWithdrawalId(null)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
      />
    </div>
  );
} 