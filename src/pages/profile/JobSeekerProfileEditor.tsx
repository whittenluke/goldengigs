import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';
import { uploadResume } from '../../lib/storage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { Switch } from '@headlessui/react';

const SKILL_OPTIONS = [
  'Project Management',
  'Leadership',
  'Strategic Planning',
  'Team Management',
  'Business Development',
  'Sales',
  'Marketing',
  'Customer Service',
  'Operations',
  'Finance',
  'Human Resources',
  'Consulting',
  'Training',
  'Mentoring',
];

const SCHEDULE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Flexible',
  'Remote',
  'Weekends',
  'Evenings',
];

interface ProfileFormData {
  full_name?: string;
  years_experience: number;
  preferred_location: {
    city: string;
    remote?: boolean;
  };
  bio: string;
  availability_status: string;
}

interface ProfileEditorProps {
  mode: 'create' | 'edit';
}

export function JobSeekerProfileEditor({ mode }: ProfileEditorProps) {
  const { user, userDetails, refreshProfile, createJobSeekerProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const [skills, setSkills] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<string[]>([]);
  const [isRemote, setIsRemote] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: mode === 'edit' ? {
      full_name: userDetails?.full_name,
      // Add other default values from profile when in edit mode
    } : undefined
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await createJobSeekerProfile({
          ...data,
          skills,
          preferred_schedule: schedules,
          preferred_location: {
            city: data.preferred_location.city,
            remote: isRemote
          }
        });
      } else {
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
            skills,
            preferred_schedule: schedules,
            preferred_location: {
              city: data.preferred_location.city,
              remote: isRemote
            },
            bio: data.bio,
            availability_status: data.availability_status,
          })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      await refreshProfile();
      navigate('/dashboard');
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
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Complete Your Profile' : 'Edit Your Profile'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Help employers understand your experience and preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {mode === 'edit' && (
            <Input
              label="Full Name"
              {...register('full_name', { required: 'Name is required' })}
              error={errors.full_name?.message}
            />
          )}

          <Input
            label="Years of Experience"
            type="number"
            {...register('years_experience', { 
              required: 'Years of experience is required',
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            error={errors.years_experience?.message}
          />

          <MultiSelect
            label="Skills"
            options={SKILL_OPTIONS}
            value={skills}
            onChange={setSkills}
            error={skills.length === 0 ? 'Please select at least one skill' : undefined}
          />

          <MultiSelect
            label="Preferred Schedule"
            options={SCHEDULE_OPTIONS}
            value={schedules}
            onChange={setSchedules}
            error={schedules.length === 0 ? 'Please select at least one schedule preference' : undefined}
          />

          <div className="space-y-6">
            <Input
              label="Preferred City"
              {...register('preferred_location.city', { 
                required: 'City is required' 
              })}
              error={errors.preferred_location?.city?.message}
            />

            <div className="flex items-center justify-between">
              <span className="flex flex-grow flex-col">
                <span className="text-sm font-medium text-gray-700">Open to Remote Work</span>
                <span className="text-sm text-gray-500">
                  Indicate if you're interested in remote opportunities
                </span>
              </span>
              <Switch
                checked={isRemote}
                onChange={setIsRemote}
                className={`${
                  isRemote ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    isRemote ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
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

          {mode === 'edit' && (
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
          )}

          <Button 
            type="submit" 
            className="w-full"
            isLoading={isLoading}
          >
            {mode === 'create' ? 'Create Profile' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
} 