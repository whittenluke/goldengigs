import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { useState } from 'react';
import { Switch } from '@headlessui/react';

type ProfileFormData = {
  years_experience: number;
  skills: string[];
  preferred_schedule: string[];
  preferred_location: {
    city: string;
    remote?: boolean;
  };
  availability_status: string;
  bio: string;
};

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

export function JobSeekerProfileForm() {
  const { createJobSeekerProfile } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>();
  const [skills, setSkills] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<string[]>([]);
  const [isRemote, setIsRemote] = useState(false);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await createJobSeekerProfile({
        ...data,
        skills,
        preferred_schedule: schedules,
        preferred_location: {
          city: data.preferred_location.city,
          remote: isRemote
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      // TODO: Add error handling UI
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
            label="Years of Experience"
            type="number"
            {...register('years_experience', { 
              required: 'Years of experience is required',
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            error={errors.years_experience?.message}
          />

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

          <Button 
            type="submit" 
            className="w-full"
            isLoading={isSubmitting}
          >
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
} 