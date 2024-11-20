import { JobPostingForm } from '../../components/jobs/JobPostingForm';

export function CreateJobPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a job posting to find experienced professionals for your team.
          </p>
        </div>

        <JobPostingForm />
      </div>
    </div>
  );
} 