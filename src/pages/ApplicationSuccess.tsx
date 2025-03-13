
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { useJobContext } from '@/context/JobContext';
import { CustomButton } from '@/components/ui/custom-button';
import { SEO } from '@/utils/seo';

const ApplicationSuccess: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobById } = useJobContext();
  
  const job = jobId ? getJobById(jobId) : undefined;
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <SEO 
        title="Application Submitted Successfully"
        description="Your job application has been submitted successfully."
      />
      
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto p-8 bg-white rounded-lg shadow-sm border border-border">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            
            <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
            
            <p className="text-muted-foreground mb-6">
              {job ? (
                <>Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been submitted successfully.</>
              ) : (
                <>Your application has been submitted successfully.</>
              )}
            </p>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation to your email address. The hiring team will review your application 
                and contact you if you're selected for the next steps.
              </p>
              
              <div className="h-px bg-border my-6"></div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {job && (
                  <Link to={`/job/${jobId}`}>
                    <CustomButton variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back to Job
                    </CustomButton>
                  </Link>
                )}
                
                <Link to="/">
                  <CustomButton className="w-full sm:w-auto">
                    <Home className="h-4 w-4 mr-1" /> Browse More Jobs
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationSuccess;
