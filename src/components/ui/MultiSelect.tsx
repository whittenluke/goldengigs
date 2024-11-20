import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function MultiSelect({ label, options, value, onChange, error }: MultiSelectProps) {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(
    option => 
      option.toLowerCase().includes(search.toLowerCase()) && 
      !value.includes(option)
  );

  const handleSelect = (option: string) => {
    onChange([...value, option]);
    setSearch('');
  };

  const handleRemove = (optionToRemove: string) => {
    onChange(value.filter(option => option !== optionToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="mt-1">
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {search && filteredOptions.length > 0 && (
        <ul className="mt-1 max-h-40 overflow-auto rounded-md border border-gray-300 bg-white shadow-sm">
          {filteredOptions.map(option => (
            <li
              key={option}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {value.map(item => (
          <span
            key={item}
            className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
          >
            {item}
            <button
              type="button"
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary-200"
              onClick={() => handleRemove(item)}
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 