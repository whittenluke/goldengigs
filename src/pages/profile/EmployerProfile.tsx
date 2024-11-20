import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ProfileFormData {
  full_name: string;
  company_name: string;
  company_size: string;
  industry: string;
  website: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
}

export function EmployerProfilePage() {
  const { user, userDetails, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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

      // Update employer profile
      const { error: profileError } = await supabase
        .from('employer_profiles')
        .update({
          company_name: data.company_name,
          company_size: data.company_size,
          industry: data.industry,
          website: data.website,
          location: {
            city: data.location.city,
            state: data.location.state,
            country: data.location.country
          }
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Company Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Help job seekers understand your company and opportunities.
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
            label="Company Name"
            {...register('company_name', { required: 'Company name is required' })}
            error={errors.company_name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Size
            </label>
            <select
              {...register('company_size', { required: 'Company size is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          <Input
            label="Industry"
            {...register('industry', { required: 'Industry is required' })}
            error={errors.industry?.message}
          />

          <Input
            label="Website"
            type="url"
            {...register('website', { 
              required: 'Website is required',
              pattern: {
                value: /^https?:\/\/.+\..+$/,
                message: 'Please enter a valid URL'
              }
            })}
            error={errors.website?.message}
          />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Location</h3>
            <Input
              label="City"
              {...register('location.city', { required: 'City is required' })}
              error={errors.location?.city?.message}
            />
            <Input
              label="State/Province"
              {...register('location.state', { required: 'State is required' })}
              error={errors.location?.state?.message}
            />
            <Input
              label="Country"
              {...register('location.country', { required: 'Country is required' })}
              error={errors.location?.country?.message}
            />
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