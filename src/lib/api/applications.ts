import { supabase } from '../supabaseClient';
import { Application } from '../../types/database';

export async function withdrawApplication(
  applicationId: string,
  reason?: string
): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .update({
      status: 'withdrawn',
      withdrawn_at: new Date().toISOString(),
      withdrawal_reason: reason
    })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs (
        title,
        employer_profiles (
          company_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function submitApplication(jobId: string): Promise<Application> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('applications')
    .insert([{
      job_id: jobId,
      status: 'pending',
      user_id: user.id
    }])
    .select(`
      *,
      job:jobs (
        title,
        employer_profiles (
          company_name
        )
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function getEmployerApplications(): Promise<Application[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs (
        title,
        employer_profiles (
          company_name
        )
      ),
      jobseeker_profile:users (
        full_name
      )
    `)
    .eq('jobs.employer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
} 