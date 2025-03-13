
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useJobContext } from '@/context/JobContext';
import { JobFilters, Job } from '@/types';
import { CustomButton } from './ui/custom-button';

const JobFilter: React.FC = () => {
  const { state, setFilter, clearFilter } = useJobContext();
  const [keyword, setKeyword] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  // Get unique locations and types from jobs
  const locations = React.useMemo(() => {
    const uniqueLocations = new Set<string>();
    state.jobs.forEach(job => {
      const mainLocation = job.location.split(',')[0].trim();
      uniqueLocations.add(mainLocation);
    });
    return Array.from(uniqueLocations);
  }, [state.jobs]);
  
  const types = React.useMemo(() => {
    const uniqueTypes = new Set<string>();
    state.jobs.forEach(job => uniqueTypes.add(job.type));
    return Array.from(uniqueTypes);
  }, [state.jobs]);
  
  // Apply filters
  const handleFilterApply = () => {
    const filters: JobFilters = {};
    
    if (keyword) {
      filters.keyword = keyword;
    }
    
    if (selectedTypes.length > 0) {
      filters.type = selectedTypes;
    }
    
    if (selectedLocations.length > 0) {
      filters.location = selectedLocations;
    }
    
    setFilter(filters);
    setShowFilter(false);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setKeyword('');
    setSelectedTypes([]);
    setSelectedLocations([]);
    clearFilter();
  };
  
  // Toggle filter drawer on mobile
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  
  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };
  
  return (
    <div className="mb-8">
      {/* Search bar */}
      <div className="relative">
        <div className="flex items-center w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-l-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <CustomButton 
            onClick={handleFilterApply}
            className="rounded-l-none rounded-r-lg px-6"
          >
            Search
          </CustomButton>
          
          <CustomButton
            variant="outline"
            onClick={toggleFilter}
            className="ml-2 md:hidden"
            aria-label="Toggle filters"
          >
            <Filter className="h-5 w-5" />
          </CustomButton>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              {state.filteredJobs.length} jobs found
            </span>
            
            {(selectedTypes.length > 0 || selectedLocations.length > 0 || keyword) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary underline flex items-center"
              >
                <X className="h-3 w-3 mr-1" /> Clear filters
              </button>
            )}
          </div>
          
          <button
            onClick={toggleFilter}
            className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-4 w-4 mr-1" /> 
            {showFilter ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className={`mt-4 transition-all duration-300 ease-in-out ${showFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:opacity-0 md:max-h-0'}`}>
        <div className="bg-secondary/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Type Filter */}
          <div>
            <h3 className="font-medium mb-2">Job Type</h3>
            <div className="space-y-2">
              {types.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="rounded text-primary focus:ring-primary/20 h-4 w-4 mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          
          {/* Location Filter */}
          <div>
            <h3 className="font-medium mb-2">Location</h3>
            <div className="space-y-2">
              {locations.map(location => (
                <label key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => handleLocationChange(location)}
                    className="rounded text-primary focus:ring-primary/20 h-4 w-4 mr-2"
                  />
                  {location}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          <CustomButton
            variant="outline"
            onClick={() => setShowFilter(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton onClick={handleFilterApply}>
            Apply Filters
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
