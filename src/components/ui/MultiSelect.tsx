import { Fragment, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { CheckIcon } from '@heroicons/react/24/outline';

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxItems?: number;
  error?: string;
  placeholder?: string;
}

export function MultiSelect({ 
  label, 
  options, 
  value, 
  onChange, 
  maxItems, 
  error, 
  placeholder = 'Select options...'
}: MultiSelectProps) {
  const [query, setQuery] = useState('');

  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase())
      );

  const handleChange = (newValue: string[]) => {
    if (!maxItems || newValue.length <= maxItems) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <Combobox value={value} onChange={handleChange} multiple>
        <Combobox.Label className="block text-sm font-medium text-gray-700">
          {label}
          {maxItems && (
            <span className="ml-1 text-sm text-gray-500">
              ({value.length}/{maxItems})
            </span>
          )}
        </Combobox.Label>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        <div className="relative mt-1">
          <Combobox.Button as="div" className="w-full">
            <div className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
              {value.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {value.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-primary-100 text-primary-700"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onChange(value.filter((i) => i !== item));
                        }}
                        className="ml-1 inline-flex rounded-md p-0.5 hover:bg-primary-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Combobox.Button>

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div className="sticky top-0 z-10 bg-white px-2 py-1.5">
              <Combobox.Input
                className="w-full border-0 bg-white p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Type to search..."
                onChange={(event) => setQuery(event.target.value)}
                displayValue={() => query}
              />
            </div>
            
            <div className="pt-1">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option}
                    value={option}
                    as={Fragment}
                  >
                    {({ active, selected }) => (
                      <li
                        className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-600 text-white' : 'text-gray-900'
                        }`}
                      >
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-primary-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </li>
                    )}
                  </Combobox.Option>
                ))
              )}
            </div>
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
} 