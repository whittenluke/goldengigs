import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCreateJob } from '../../hooks/useCreateJob';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  schedule_type: z.string(),
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

type JobFormData = z.infer<typeof jobSchema>;

export function CreateJobPage() {
  const navigate = useNavigate();
  const { mutate: createJob, isLoading } = useCreateJob();
  
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema)
  });

  const onSubmit = (data: JobFormData) => {
    createJob(data, {
      onSuccess: () => {
        navigate('/employer/jobs');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Job Posting</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Job Title"
          {...register('title')}
          error={errors.title?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Add remaining form fields for requirements, schedule, location, salary */}
        
        <Button type="submit" isLoading={isLoading}>
          Create Job Posting
        </Button>
      </form>
    </div>
  );
} 