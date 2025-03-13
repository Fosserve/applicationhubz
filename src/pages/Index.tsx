
import React, { useEffect } from 'react';
import { useJobContext } from '@/context/JobContext';
import JobCard from '@/components/JobCard';
import JobFilter from '@/components/JobFilter';
import { SEO } from '@/utils/seo';

const Index: React.FC = () => {
  const { state } = useJobContext();
  
  return (
    <>
      <SEO 
        title="Find Your Dream Job" 
        description="Browse through hundreds of job opportunities across various industries and locations."
        keywords={['job listings', 'career opportunities', 'employment']}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide text-primary-foreground bg-white/20 rounded-full backdrop-blur-sm mb-4">
              Thousands of opportunities waiting for you
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Browse through our extensive list of opportunities 
              and take the next step in your career journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* Job Listings */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <JobFilter />
          
          <div className="space-y-8">
            {state.loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-secondary/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : state.filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {state.filteredJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose JobHub</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We connect talented individuals with top companies, making the job search process easier for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Curated Job Listings</h3>
              <p className="text-muted-foreground">
                Access carefully selected job opportunities from reputable companies across various industries.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Application Process</h3>
              <p className="text-muted-foreground">
                Apply to jobs with just a few clicks, and track your application status in real-time.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Employers</h3>
              <p className="text-muted-foreground">
                All employers on our platform are verified to ensure a safe and legitimate job hunting experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
