import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { JobCard } from '../../components/jobs/JobCard';
import { supabase } from '../../lib/supabaseClient';
import { Job } from '../../types/database';

function formatJobForCard(job: Job) {
  return {
    id: job.id,
    title: job.title,
    company: 'Your Company', // TODO: Join with employer_profiles to get company name
    location: typeof job.location === 'object' && 'city' in job.location 
      ? `${job.location.city}, ${job.location.state}` 
      : 'Remote',
    salary: `$${job.salary_range.min.toLocaleString()} - $${job.salary_range.max.toLocaleString()}`,
    schedule: job.schedule_type,
    description: job.description
  };
}

export function ManageJobsPage() {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['jobs', 'employer'],
    queryFn: async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*, employer_profiles(company_name)')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Jobs</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your job postings and their current status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/jobs/create">
            <Button>Post New Job</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {jobs?.map((job: Job) => (
          <JobCard key={job.id} {...formatJobForCard(job)} />
        ))}
      </div>
    </div>
  );
} 