import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Job } from '../../types/database';
import { useUpdateJobStatus } from '../../hooks/useUpdateJobStatus';
import { toast } from 'react-hot-toast';
import { useSubmitApplication } from '../../hooks/useSubmitApplication';
import { useState } from 'react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userDetails } = useAuth();
  
  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          employer_profiles (
            company_name,
            company_size,
            industry,
            location,
            website
          )
        `)
        .eq('id', id)
        .single();
      
      if (!data) throw new Error('Job not found');
      return data;
    }
  });

  const updateStatus = useUpdateJobStatus(id!);
  const submitApplication = useSubmitApplication();

  const { data: existingApplication } = useQuery({
    queryKey: ['application', job?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select('id, status')
        .eq('job_id', job?.id)
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!job?.id && !!user?.id
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  const handleStatusToggle = async () => {
    try {
      const newStatus = job.status === 'active' ? 'inactive' : 'active';
      await updateStatus.mutateAsync(newStatus);
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  const isEmployerView = userDetails?.user_type === 'employer' && user?.id === job.employer_id;

  const handleEdit = () => {
    navigate(`/employer/jobs/${id}/edit`);
  };

  const handleApply = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmApply = async () => {
    if (!job?.id) return;
    
    try {
      await submitApplication.mutateAsync(job.id);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Application submission failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="mt-2 text-lg text-gray-600">
              {job.employer_profiles.company_name}
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>{typeof job.location === 'object' && 'city' in job.location 
                ? `${job.location.city}, ${job.location.state}` 
                : 'Remote'}</span>
              <span>•</span>
              <span>{job.schedule_type}</span>
              <span>•</span>
              <span>${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}</span>
            </div>
          </div>
          
          {isEmployerView ? (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleEdit}>
                Edit Job
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleStatusToggle}
                isLoading={updateStatus.isLoading}
              >
                {job.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleApply}
              isLoading={submitApplication.isLoading}
              disabled={!!existingApplication}
            >
              {existingApplication ? 'Already Applied' : 'Apply Now'}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Job Description */}
          <section className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold mb-4">About this Role</h2>
            <div className="whitespace-pre-wrap">{job.description}</div>
            
            {job.requirements && job.requirements.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-8 mb-4">Requirements</h2>
                <ul className="list-disc pl-5">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Company Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">{job.employer_profiles.industry}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                <dd className="mt-1 text-sm text-gray-900">{job.employer_profiles.company_size}</dd>
              </div>
              {job.employer_profiles.website && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a 
                      href={job.employer_profiles.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {job.employer_profiles.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmApply}
        title="Submit Application"
        message="Are you sure you want to apply for this position? Your profile information will be shared with the employer."
        confirmText="Submit Application"
        cancelText="Cancel"
      />
    </div>
  );
} 