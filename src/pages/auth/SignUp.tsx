import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/auth';

interface SignUpForm {
  email: string;
  password: string;
  userType: 'employer' | 'jobseeker';
}

export function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>();
  const [error, setError] = useState<string>();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpForm) => {
    try {
      await signUp(data.email, data.password, data.userType);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message?.includes('user_already_exists')) {
        setError('This email is already registered. Please try logging in instead.');
      } else if (err.message?.includes('rate limit')) {
        setError('Too many signup attempts. Please try again later.');
      } else {
        setError('An error occurred during sign up. Please try again.');
      }
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
              {error.includes('already registered') && (
                <Link 
                  to="/login" 
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Go to login →
                </Link>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              error={errors.password?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                {...register('userType', { required: 'Please select your role' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}