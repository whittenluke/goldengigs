import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  created_at: string;
  job: {
    title: string;
  };
  jobseeker_profile: {
    full_name: string;
    years_experience: number;
  };
}

export function ApplicationsPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['employer', 'applications'],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(title),
          jobseeker_profile:jobseeker_profiles(full_name, years_experience)
        `)
        .order('created_at', { ascending: false });
      return data as Application[];
    }
  });

  if (isLoading) return <div>Loading...</div>;

  if (!applications?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Applications</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Applications Yet
          </h3>
          <p className="text-gray-500 mb-4">
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
                        {application.jobseeker_profile.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied for: {application.job.title}
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