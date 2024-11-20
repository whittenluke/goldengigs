import { useQuery } from '@tanstack/react-query';
import { JobSearch } from '../../components/jobs/JobSearch';
import { JobCard } from '../../components/jobs/JobCard';
import { supabase } from '../../lib/supabaseClient';
import { Job } from '../../types/database';

function formatJobForCard(job: Job) {
  return {
    id: job.id,
    title: job.title,
    company: job.employer_profiles.company_name,
    location: typeof job.location === 'object' && 'city' in job.location 
      ? `${job.location.city}, ${job.location.state}` 
      : 'Remote',
    salary: `$${job.salary_range.min.toLocaleString()} - $${job.salary_range.max.toLocaleString()}`,
    schedule: job.schedule_type,
    description: job.description
  };
}

export function SearchPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', 'search'],
    queryFn: async () => {
      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          employer_profiles (
            company_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover flexible roles that value your experience
          </p>
        </div>

        <JobSearch onSearch={(data) => console.log(data)} />

        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            <div>Loading...</div>
          ) : jobs?.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No jobs found. Check back soon for new opportunities!
            </div>
          ) : (
            jobs?.map((job) => (
              <JobCard key={job.id} {...formatJobForCard(job)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}