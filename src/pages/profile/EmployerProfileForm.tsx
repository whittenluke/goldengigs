import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { EmployerProfile } from '../../types/database';

const profileSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_size: z.string().min(1, 'Company size is required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Must be a valid URL'),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required')
  })
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EmployerProfileFormProps {
  initialData?: EmployerProfile;
  onSuccess: () => void;
}

export function EmployerProfileForm({ initialData, onSuccess }: EmployerProfileFormProps) {
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      location: { city: '', state: '', country: '' }
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    const { error } = await supabase
      .from('employer_profiles')
      .upsert({
        id: user.id,
        ...data,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900">
        {initialData ? 'Edit Company Profile' : 'Complete Company Profile'}
      </h2>

      <Input
        label="Company Name"
        {...register('company_name')}
        error={errors.company_name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Size
        </label>
        <select
          {...register('company_size')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select size...</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501+">501+ employees</option>
        </select>
        {errors.company_size && (
          <p className="mt-1 text-sm text-red-600">{errors.company_size.message}</p>
        )}
      </div>

      <Input
        label="Industry"
        {...register('industry')}
        error={errors.industry?.message}
      />

      <Input
        label="Website"
        type="url"
        {...register('website')}
        error={errors.website?.message}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

        <Input
          label="Country"
          {...register('location.country')}
          error={errors.location?.country?.message}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
} 