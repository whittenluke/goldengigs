import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { Switch } from '@headlessui/react';

// Validation schema
const profileSchema = z.object({
  years_experience: z.number()
    .min(0, 'Years of experience must be 0 or greater')
    .max(60, 'Please enter a valid number of years'),
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(500, 'Bio must be less than 500 characters'),
  skills: z.array(z.string())
    .min(1, 'Please select at least one skill'),
  preferred_schedule: z.array(z.string())
    .min(1, 'Please select at least one schedule preference'),
  preferred_location: z.object({
    city: z.string()
      .min(2, 'City name must be at least 2 characters')
      .max(50, 'City name must be less than 50 characters'),
    remote: z.boolean().optional()
  }),
  availability_status: z.enum(['available', 'open', 'unavailable'])
});

type ProfileFormData = z.infer<typeof profileSchema>;

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      years_experience: 0,
      skills: [],
      preferred_schedule: [],
      preferred_location: {
        city: '',
        remote: false
      },
      availability_status: 'open',
      bio: ''
    }
  });

  const remoteEnabled = watch('preferred_location.remote');

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await createJobSeekerProfile({
        ...formData,
        preferred_location: {
          city: formData.preferred_location.city,
          remote: remoteEnabled
        }
      });
      toast.success('Profile created successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Help employers understand your experience and preferences.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Years of Experience"
            type="number"
            {...register('years_experience', { valueAsNumber: true })}
            error={errors.years_experience?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Availability Status
            </label>
            <select
              {...register('availability_status')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="available">Available Now</option>
              <option value="open">Open to Opportunities</option>
              <option value="unavailable">Not Available</option>
            </select>
            {errors.availability_status && (
              <p className="mt-1 text-sm text-red-600">{errors.availability_status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              {...register('bio')}
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
            value={watch('skills')}
            onChange={(value) => setValue('skills', value)}
            error={errors.skills?.message}
            maxItems={10}
          />

          <MultiSelect
            label="Preferred Schedule"
            options={SCHEDULE_OPTIONS}
            value={watch('preferred_schedule')}
            onChange={(value) => setValue('preferred_schedule', value)}
            error={errors.preferred_schedule?.message}
            maxItems={5}
          />

          <div className="space-y-6">
            <Input
              label="Preferred City"
              {...register('preferred_location.city')}
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
                checked={remoteEnabled}
                onChange={(checked) => setValue('preferred_location.remote', checked)}
                className={`${
                  remoteEnabled ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    remoteEnabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
          >
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
} 