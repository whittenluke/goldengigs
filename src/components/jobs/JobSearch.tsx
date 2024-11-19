import { useForm } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SearchForm {
  query: string;
  location: string;
}

interface JobSearchProps {
  onSearch: (data: SearchForm) => void;
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const { register, handleSubmit } = useForm<SearchForm>();

  return (
    <form onSubmit={handleSubmit(onSearch)} className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Input
            label="Search Jobs"
            placeholder="Job title or keyword"
            {...register('query')}
          />
        </div>
        
        <div className="flex-1">
          <Input
            label="Location"
            placeholder="City or remote"
            {...register('location')}
          />
        </div>

        <Button type="submit" className="flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}