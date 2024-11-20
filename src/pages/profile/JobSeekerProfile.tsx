import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';
import { uploadResume } from '../../lib/storage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

type ProfileFormData = {
  full_name: string;
  years_experience: number;
  skills: string;
  preferred_schedule: string[];
  bio: string;
  availability_status: string;
};

export function JobSeekerProfilePage() {
  const { user, userDetails, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user details
      const { error: userError } = await supabase
        .from('users')
        .update({ full_name: data.full_name })
        .eq('id', user.id);

      if (userError) throw userError;

      // Update profile
      const { error: profileError } = await supabase
        .from('jobseeker_profiles')
        .update({
          years_experience: data.years_experience,
          skills: data.skills.split(',').map(s => s.trim()),
          preferred_schedule: data.preferred_schedule,
          bio: data.bio,
          availability_status: data.availability_status,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    setUploadError(undefined);

    try {
      const filePath = await uploadResume(file, user.id);
      
      const { error: updateError } = await supabase
        .from('jobseeker_profiles')
        .update({ resume_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      await refreshProfile();
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadError('Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Help employers understand your experience and preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Full Name"
            {...register('full_name', { required: 'Name is required' })}
            defaultValue={userDetails?.full_name}
            error={errors.full_name?.message}
          />

          <Input
            label="Years of Experience"
            type="number"
            {...register('years_experience', { 
              required: 'Years of experience is required',
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            error={errors.years_experience?.message}
          />

          <Input
            label="Skills (comma-separated)"
            {...register('skills', { required: 'At least one skill is required' })}
            placeholder="Project Management, Leadership, Strategic Planning"
            error={errors.skills?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Schedule
            </label>
            <div className="mt-2 space-y-2">
              {['Full-time', 'Part-time', 'Contract', 'Remote'].map((schedule) => (
                <label key={schedule} className="inline-flex items-center mr-6">
                  <input
                    type="checkbox"
                    value={schedule}
                    {...register('preferred_schedule')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{schedule}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Availability Status
            </label>
            <select
              {...register('availability_status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="available">Available Now</option>
              <option value="open">Open to Opportunities</option>
              <option value="unavailable">Not Available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              {...register('bio', { 
                required: 'Bio is required',
                maxLength: { value: 500, message: 'Bio must be less than 500 characters' }
              })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Tell employers about your experience and what you're looking for..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resume
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
            {uploadError && (
              <p className="mt-1 text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 