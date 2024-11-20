import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { JobPostingForm } from '../../components/jobs/JobPostingForm';
import { supabase } from '../../lib/supabaseClient';

export function EditJobPage() {
  const { id } = useParams();
  
  const { data: job, isLoading } = useQuery({
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
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Job</h1>
      <JobPostingForm mode="edit" initialData={job} />
    </div>
  );
} 