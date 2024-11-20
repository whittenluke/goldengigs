import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCreateJob } from '../../hooks/useCreateJob';
import { useUpdateJob } from '../../hooks/useUpdateJob';
import { toast } from 'react-hot-toast';
import { Job } from '../../types/database';

const jobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string())
    .min(1, 'At least one requirement is needed'),
  schedule_type: z.string().min(1, 'Schedule type is required'),
  location: z.object({
    type: z.enum(['onsite', 'hybrid', 'remote']),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional()
  }),
  salary_range: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }),
  is_remote: z.boolean()
});

type JobPostingFormData = z.infer<typeof jobPostingSchema>;

const SCHEDULE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Flexible',
  'Remote',
];

interface JobPostingFormProps {
  mode?: 'create' | 'edit';
  initialData?: Job;
}

export function JobPostingForm({ mode = 'create', initialData }: JobPostingFormProps) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob(initialData?.id || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      requirements: initialData.requirements,
      schedule_type: initialData.schedule_type,
      location: initialData.location,
      salary_range: initialData.salary_range,
      is_remote: initialData.is_remote
    } : {
      is_remote: false,
      location: {
        type: 'onsite'
      },
      requirements: []
    }
  });

  const locationType = watch('location.type');

  const onSubmit = async (data: JobPostingFormData) => {
    try {
      if (mode === 'edit') {
        await updateJob.mutateAsync(data);
        toast.success('Job updated successfully!');
      } else {
        await createJob.mutateAsync(data);
        toast.success('Job posted successfully!');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save job. Please try again.');
    }
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const reqArray = e.target.value
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);
    setValue('requirements', reqArray);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Job Title"
        {...register('title')}
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Describe the role, responsibilities, and ideal candidate..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location Type
        </label>
        <select
          {...register('location.type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      {locationType !== 'remote' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="City"
            {...register('location.city')}
            error={errors.location?.city?.message}
          />
          <Input
            label="State"
            {...register('location.state')}
            error={errors.location?.state?.message}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Minimum Salary"
          type="number"
          {...register('salary_range.min', { valueAsNumber: true })}
          error={errors.salary_range?.min?.message}
        />
        <Input
          label="Maximum Salary"
          type="number"
          {...register('salary_range.max', { valueAsNumber: true })}
          error={errors.salary_range?.max?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Schedule Type
        </label>
        <select
          {...register('schedule_type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          {SCHEDULE_OPTIONS.map(option => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Requirements
        </label>
        <textarea
          value={Array.isArray(watch('requirements')) ? watch('requirements').join('\n') : ''}
          onChange={handleRequirementsChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Enter each requirement on a new line"
        />
        {errors.requirements && (
          <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter each requirement on a new line
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        {mode === 'edit' ? 'Save Changes' : 'Post Job'}
      </Button>
    </form>
  );
} 