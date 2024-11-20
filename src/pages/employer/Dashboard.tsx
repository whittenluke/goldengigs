import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';

export function EmployerDashboard() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ['employer', 'dashboard-stats'],
    queryFn: async () => {
      // Get active jobs count for current employer
      const { count: activeJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('employer_id', user?.id)
        .eq('status', 'active');

      // Get total applications count for current employer's jobs
      const { count: totalApplications } = await supabase
        .from('applications')
        .select('*, jobs!inner(*)')
        .eq('jobs.employer_id', user?.id);

      return {
        activeJobs: activeJobs || 0,
        totalApplications: totalApplications || 0
      };
    },
    enabled: !!user // Only run query if user is authenticated
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
        <Link to="/employer/jobs/create">
          <Button>Post New Job</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Active Job Postings
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats?.activeJobs || 0}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Applications
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats?.totalApplications || 0}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
} 