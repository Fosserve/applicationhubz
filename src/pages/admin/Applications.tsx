
import React from 'react';
import { SEO } from '@/utils/seo';

const Applications: React.FC = () => {
  return (
    <>
      <SEO 
        title="Applications" 
        description="Review and manage job applications on JobHub."
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Applications</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <p className="text-muted-foreground text-center py-8">
            Application management functionality will be implemented in future updates.
          </p>
        </div>
      </div>
    </>
  );
};

export default Applications;
