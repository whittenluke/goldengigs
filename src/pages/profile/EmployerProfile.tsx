import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { EmployerProfileForm } from './EmployerProfileForm';
import type { EmployerProfile } from '../../types/database';

export function EmployerProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['employer-profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      return data as EmployerProfile;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  if (!profile || isEditing) {
    return <EmployerProfileForm 
      initialData={profile} 
      onSuccess={() => setIsEditing(false)}
    />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {profile.company_name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {profile.industry}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Company Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.company_size}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.website}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.location.city}, {profile.location.state}, {profile.location.country}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 