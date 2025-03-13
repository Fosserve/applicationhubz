
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import { SEO } from '@/utils/seo';
import { SEOProps } from '@/types';

interface MainLayoutProps {
  seo?: SEOProps;
}

const MainLayout: React.FC<MainLayoutProps> = ({ seo }) => {
  return (
    <>
      <SEO {...seo} />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <AnimatedTransition className="h-full">
            <Outlet />
          </AnimatedTransition>
        </main>
        <footer className="bg-secondary py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">JobHub</h3>
                <p className="text-muted-foreground">
                  Connecting talent with opportunity. Find your dream job or the perfect candidate.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/login" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sign In
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <address className="not-italic text-muted-foreground">
                  <p>Email: contact@jobhub.com</p>
                  <p>Phone: (123) 456-7890</p>
                </address>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} JobHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainLayout;
