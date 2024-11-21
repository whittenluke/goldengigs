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