import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';

interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    employer_id: string;
  };
  users?: {
    id: string;
    full_name: string;
  };
}

export function ApplicationsPage() {
  const { user } = useAuth();

  const { data: applications = [], isLoading } = useQuery<Application[], Error>({
    queryKey: ['applications', 'employer', user?.id] as const,
    queryFn: async () => {
      console.log('Fetching applications for employer:', user?.id);
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          user_id,
          jobs!inner (
            id,
            title,
            employer_id
          )
        `)
        .eq('jobs.employer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      // If we have applications, fetch the user details
      if (data && data.length > 0) {
        const userIds = data.map(app => app.user_id);
        const { data: users } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', userIds);

        // Merge user data with applications
        return data.map(application => ({
          ...application,
          jobs: application.jobs[0],
          users: users?.find(u => u.id === application.user_id)
        })) as Application[];
      }

      return [] as Application[];
    },
    enabled: !!user
  });

  if (isLoading) return <div>Loading...</div>;

  if (!applications.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Applications</h1>
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <p className="text-gray-500">No Applications Yet</p>
          <p className="mt-2 text-sm text-gray-500">
            Applications from job seekers will appear here once they start applying to your jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Applications</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.map((application) => (
            <li key={application.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.users?.full_name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied for: {application.jobs?.title || 'Unknown Position'}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {application.status}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 