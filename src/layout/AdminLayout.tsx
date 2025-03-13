
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { SEO } from '@/utils/seo';

const AdminLayout: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium">Loading...</div>
      </div>
    );
  }
  
  return (
    <>
      <SEO 
        title="Admin Dashboard" 
        description="JobHub admin dashboard for managing jobs and applications."
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <AnimatedTransition className="h-full">
            <Outlet />
          </AnimatedTransition>
        </main>
        <footer className="bg-secondary py-4">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} JobHub Admin. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AdminLayout;
