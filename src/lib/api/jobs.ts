import { supabase } from '../supabaseClient';
import { Job } from '../../types/database';

interface CreateJobData {
  title: string;
  description: string;
  requirements: string[];
  schedule_type: string;
  location: {
    type: 'onsite' | 'hybrid' | 'remote';
    city?: string;
    state?: string;
    country?: string;
  };
  salary_range: {
    min: number;
    max: number;
  };
  is_remote: boolean;
}

export async function createJob(jobData: CreateJobData): Promise<Job> {
  // First get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get the employer profile using the user's ID
  const { data: profile } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    throw new Error('Employer profile not found');
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        employer_id: user.id, // Use the authenticated user's ID
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements || [], // Ensure requirements is an array
        schedule_type: jobData.schedule_type,
        location: jobData.location,
        salary_range: jobData.salary_range,
        is_remote: jobData.is_remote,
        status: 'active'
      }
    ])
    .select(`
      *,
      employer_profiles (
        company_name
      )
    `)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }
  if (!data) throw new Error('Failed to create job');
  
  return data as Job;
} 