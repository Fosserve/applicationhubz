
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Job } from '@/types';
import { CustomButton } from './ui/custom-button';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';

interface JobCardProps {
  job: Job;
  index: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const { ref, isInView } = useInView();

  return (
    <div 
      ref={ref}
      className={cn(
        "staggered-item rounded-xl overflow-hidden transition-all duration-500 ease-out border border-border bg-white hover:shadow-lg",
        { "in-view": isInView }
      )}
      style={{ 
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className={cn(
        "p-6",
        job.featured && "border-l-4 border-l-primary"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center mr-4 overflow-hidden">
              <img 
                src={job.logo || '/placeholder.svg'} 
                alt={`${job.company} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>
          
          {job.featured && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-1" />
            {job.type}
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            {job.salary}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(job.postedDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <Link to={`/job/${job.id}`}>
            <CustomButton variant="default">
              View Details
            </CustomButton>
          </Link>
          
          <span className="text-sm text-muted-foreground">
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
