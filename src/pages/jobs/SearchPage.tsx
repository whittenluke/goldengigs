import { useState } from 'react';
import { JobSearch } from '../../components/jobs/JobSearch';
import { JobCard } from '../../components/jobs/JobCard';

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Project Manager',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    salary: '$80,000 - $120,000',
    schedule: 'Part-time / Flexible',
    description: 'Lead strategic projects with our enterprise clients. Bring your years of experience to mentor junior team members while managing critical initiatives.',
  },
  {
    id: '2',
    title: 'Business Development Consultant',
    company: 'Growth Partners LLC',
    location: 'Hybrid - New York',
    salary: '$90,000 - $130,000',
    schedule: 'Contract / 20hrs week',
    description: 'Leverage your industry connections and expertise to help scale our business consulting practice. Perfect for experienced executives looking for flexible engagement.',
  },
];

export function SearchPage() {
  const [jobs] = useState(MOCK_JOBS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover flexible roles that value your experience
          </p>
        </div>

        <JobSearch onSearch={(data) => console.log(data)} />

        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
}