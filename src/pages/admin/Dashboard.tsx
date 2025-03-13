
import React from 'react';
import { SEO } from '@/utils/seo';

const Dashboard: React.FC = () => {
  return (
    <>
      <SEO 
        title="Admin Dashboard" 
        description="JobHub administration dashboard for managing jobs and applications."
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Applications</h3>
            <p className="text-3xl font-bold">48</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-2">New Applications</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground text-center py-8">
            Admin dashboard functionality will be implemented in future updates.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
