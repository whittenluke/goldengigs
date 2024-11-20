import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useDeleteJob } from '../../hooks/useDeleteJob';
import { useState } from 'react';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  schedule: string;
  description: string;
  showActions?: boolean;
}

export function JobCard({ 
  id, 
  title, 
  company, 
  location, 
  salary, 
  schedule, 
  description,
  showActions = false
}: JobCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { mutate: deleteJob, isLoading: isDeleting } = useDeleteJob();

  const handleDelete = () => {
    deleteJob(id);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/jobs/${id}`} className="text-xl font-semibold text-gray-900 hover:text-primary-600">
                {title}
              </Link>
              <p className="text-base font-medium text-gray-700">{company}</p>
            </div>
            {showActions && (
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteConfirm(true)}
                isLoading={isDeleting}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
              {location}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
              {salary}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
              {schedule}
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          <div className="pt-4">
            <Link 
              to={`/jobs/${id}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
      />
    </>
  );
}