export interface User {
  id: string;
  user_type: 'employer' | 'jobseeker';
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface JobSeekerProfile {
  id: string;
  years_experience: number;
  skills: string[];
  preferred_schedule: string[];
  preferred_location: {
    city: string;
    remote?: boolean;
  };
  resume_url?: string;
  availability_status: string;
  bio: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  company_name: string;
  company_size: string;
  industry: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  website: string;
  verified: boolean;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements: string[];
  schedule_type: string;
  location: {
    type?: 'remote';
    city?: string;
    state?: string;
    country?: string;
  };
  salary_range: {
    min: number;
    max: number;
  };
  is_remote: boolean;
  status: string;
  created_at: string;
  expires_at?: string;
} 