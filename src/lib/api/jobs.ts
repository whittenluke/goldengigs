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
  const { data: profile } = await supabase
    .from('employer_profiles')
    .select('id')
    .single();

  if (!profile) {
    throw new Error('Employer profile not found');
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        employer_id: profile.id,
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        schedule_type: jobData.schedule_type,
        location: jobData.location,
        salary_range: jobData.salary_range,
        is_remote: jobData.is_remote,
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create job');
  
  return data as Job;
} 