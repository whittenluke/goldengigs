import { supabase } from './supabaseClient';

export async function uploadResume(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `resumes/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('resumes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  return filePath;
} 