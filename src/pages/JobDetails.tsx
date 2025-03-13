
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, DollarSign, Share, ArrowLeft, Check } from 'lucide-react';
import { useJobContext } from '@/context/JobContext';
import { CustomButton } from '@/components/ui/custom-button';
import ApplicationForm from '@/components/ApplicationForm';
import { SEO } from '@/utils/seo';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getJobById } = useJobContext();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const job = getJobById(id || '');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!job) {
      navigate('/');
    }
  }, [job, navigate]);
  
  if (!job) {
    return null; // Redirecting in useEffect
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job opportunity: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
  };
  
  const handleApplyClick = () => {
    if (!currentUser) {
      toast.error('Please sign in to apply for this job');
      navigate('/login');
      return;
    }
    
    setShowApplicationForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('application-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  return (
    <>
      <SEO 
        title={`${job.title} at ${job.company}`}
        description={job.description.substring(0, 160)}
        keywords={[job.title, job.company, job.type, 'job opening', 'career opportunity']}
      />
      
      <div className="min-h-screen">
        {/* Job Header */}
        <section className="bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all jobs
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded bg-secondary flex items-center justify-center mr-4 overflow-hidden border border-border">
                  <img 
                    src={job.logo || '/placeholder.svg'} 
                    alt={`${job.company} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                  <p className="text-lg text-muted-foreground">{job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <CustomButton
                  onClick={handleApplyClick}
                  variant="default"
                  className="min-w-28"
                >
                  Apply Now
                </CustomButton>
                
                <CustomButton
                  onClick={handleShare}
                  variant="outline"
                  aria-label="Share job"
                >
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </CustomButton>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
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
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </section>
        
        {/* Job Content */}
        <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p>{job.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 bg-primary/10 rounded-full text-primary flex-shrink-0 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 bg-primary/10 rounded-full text-primary flex-shrink-0 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 bg-primary/10 rounded-full text-primary flex-shrink-0 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Side Content */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-secondary/50 rounded-lg p-6 border border-border">
                  <h3 className="font-semibold mb-4">Job Overview</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Job Title:</dt>
                      <dd className="font-medium">{job.title}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Company:</dt>
                      <dd className="font-medium">{job.company}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Location:</dt>
                      <dd className="font-medium">{job.location}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Job Type:</dt>
                      <dd className="font-medium">{job.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Salary:</dt>
                      <dd className="font-medium">{job.salary}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Posted Date:</dt>
                      <dd className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Deadline:</dt>
                      <dd className="font-medium">{new Date(job.deadline).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="text-center">
                  <CustomButton
                    onClick={handleApplyClick}
                    className="w-full"
                  >
                    Apply Now
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Application Form */}
        {showApplicationForm && (
          <section 
            id="application-form"
            className="container mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-border"
          >
            <h2 className="text-2xl font-bold mb-6">Apply for this position</h2>
            <ApplicationForm job={job} />
          </section>
        )}
      </div>
    </>
  );
};

export default JobDetails;
