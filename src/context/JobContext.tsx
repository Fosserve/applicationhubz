
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Job, Application, JobFilters } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Action types
type JobAction = 
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'SET_FILTER'; payload: JobFilters }
  | { type: 'CLEAR_FILTER' }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: Application }
  | { type: 'SET_LOADING'; payload: boolean };

interface JobState {
  jobs: Job[];
  filteredJobs: Job[];
  applications: Application[];
  filters: JobFilters;
  loading: boolean;
}

const initialState: JobState = {
  jobs: [],
  filteredJobs: [],
  applications: [],
  filters: {},
  loading: false
};

const jobReducer = (state: JobState, action: JobAction): JobState => {
  switch (action.type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload,
        filteredJobs: applyFilters(action.payload, state.filters)
      };
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
        filteredJobs: applyFilters([...state.jobs, action.payload], state.filters)
      };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => job.id === action.payload.id ? action.payload : job),
        filteredJobs: applyFilters(
          state.jobs.map(job => job.id === action.payload.id ? action.payload : job),
          state.filters
        )
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
        filteredJobs: applyFilters(
          state.jobs.filter(job => job.id !== action.payload),
          state.filters
        )
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        filteredJobs: applyFilters(state.jobs, { ...state.filters, ...action.payload })
      };
    case 'CLEAR_FILTER':
      return {
        ...state,
        filters: {},
        filteredJobs: state.jobs
      };
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload
      };
    case 'ADD_APPLICATION':
      return {
        ...state,
        applications: [...state.applications, action.payload]
      };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app => 
          app.id === action.payload.id ? action.payload : app
        )
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Helper function to apply filters
const applyFilters = (jobs: Job[], filters: JobFilters): Job[] => {
  return jobs.filter(job => {
    // Filter by job type
    if (filters.type && filters.type.length > 0 && !filters.type.includes(job.type)) {
      return false;
    }
    
    // Filter by location
    if (filters.location && filters.location.length > 0 && 
        !filters.location.some(loc => job.location.includes(loc))) {
      return false;
    }
    
    // Filter by keyword
    if (filters.keyword && filters.keyword.trim() !== '') {
      const keyword = filters.keyword.toLowerCase();
      return (
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }
    
    return true;
  });
};

// Create the context
interface JobContextType {
  state: JobState;
  setJobs: (jobs: Job[]) => void;
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, 'id'>) => Promise<Job | null>;
  updateJob: (job: Job) => Promise<Job | null>;
  deleteJob: (id: string) => Promise<boolean>;
  setFilter: (filter: JobFilters) => void;
  clearFilter: () => void;
  fetchApplications: () => Promise<void>;
  addApplication: (application: Omit<Application, 'id' | 'submittedAt'>) => Promise<Application | null>;
  updateApplication: (application: Application) => Promise<Application | null>;
  getJobById: (id: string) => Promise<Job | null>;
  getApplicationsForJob: (jobId: string) => Application[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Provider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  // Fetch jobs from Supabase on mount
  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const typedJobs = data.map(job => ({
        ...job,
        id: job.id,
        postedDate: job.posted_date,
        deadline: job.deadline,
        logo: job.logo || '/placeholder.svg',
        featured: job.featured || false,
        type: job.type as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote',
      })) as Job[];
      
      dispatch({ type: 'SET_JOBS', payload: typedJobs });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again later.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add a new job to Supabase
  const addJob = async (jobData: Omit<Job, 'id'>): Promise<Job | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          type: jobData.type,
          salary: jobData.salary,
          description: jobData.description,
          requirements: jobData.requirements,
          responsibilities: jobData.responsibilities,
          benefits: jobData.benefits,
          deadline: jobData.deadline,
          logo: jobData.logo,
          featured: jobData.featured
        }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newJob: Job = {
        ...data,
        id: data.id,
        postedDate: data.posted_date,
        deadline: data.deadline,
        logo: data.logo || '/placeholder.svg',
        featured: data.featured || false,
        type: data.type as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote',
      };
      
      dispatch({ type: 'ADD_JOB', payload: newJob });
      toast.success('Job added successfully!');
      return newJob;
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to add job. Please try again.');
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update a job in Supabase
  const updateJob = async (job: Job): Promise<Job | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          benefits: job.benefits,
          deadline: job.deadline,
          logo: job.logo,
          featured: job.featured
        })
        .eq('id', job.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedJob: Job = {
        ...data,
        id: data.id,
        postedDate: data.posted_date,
        deadline: data.deadline,
        logo: data.logo || '/placeholder.svg',
        featured: data.featured || false,
        type: data.type as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote',
      };
      
      dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
      toast.success('Job updated successfully!');
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job. Please try again.');
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete a job from Supabase
  const deleteJob = async (id: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      dispatch({ type: 'DELETE_JOB', payload: id });
      toast.success('Job deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job. Please try again.');
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch applications from Supabase
  const fetchApplications = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Map the data structure from Supabase to our Application type
      const typedApplications: Application[] = data.map(app => ({
        id: app.id,
        jobId: app.job_id,
        fullName: app.full_name,
        email: app.email,
        phone: app.phone,
        resume: app.resume,
        coverLetter: app.cover_letter || undefined,
        status: app.status as 'Pending' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected',
        submittedAt: app.submitted_at,
        notes: app.notes || undefined,
        userId: app.user_id || undefined
      }));
      
      dispatch({ type: 'SET_APPLICATIONS', payload: typedApplications });
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications. Please try again later.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add a new application to Supabase
  const addApplication = async (applicationData: Omit<Application, 'id' | 'submittedAt'>): Promise<Application | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          job_id: applicationData.jobId,
          full_name: applicationData.fullName,
          email: applicationData.email,
          phone: applicationData.phone,
          resume: applicationData.resume,
          cover_letter: applicationData.coverLetter,
          status: applicationData.status,
          notes: applicationData.notes,
          user_id: applicationData.userId
        }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newApplication: Application = {
        ...data,
        id: data.id,
        jobId: data.job_id,
        fullName: data.full_name,
        submittedAt: data.submitted_at,
        coverLetter: data.cover_letter,
        userId: data.user_id,
        status: data.status as 'Pending' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected',
      };
      
      dispatch({ type: 'ADD_APPLICATION', payload: newApplication });
      toast.success('Application submitted successfully!');
      return newApplication;
    } catch (error) {
      console.error('Error adding application:', error);
      toast.error('Failed to submit application. Please try again.');
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update an application in Supabase
  const updateApplication = async (application: Application): Promise<Application | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          job_id: application.jobId,
          full_name: application.fullName,
          email: application.email,
          phone: application.phone,
          resume: application.resume,
          cover_letter: application.coverLetter,
          status: application.status,
          notes: application.notes
        })
        .eq('id', application.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedApplication: Application = {
        ...data,
        id: data.id,
        jobId: data.job_id,
        fullName: data.full_name,
        submittedAt: data.submitted_at,
        coverLetter: data.cover_letter,
        userId: data.user_id,
        status: data.status as 'Pending' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected',
      };
      
      dispatch({ type: 'UPDATE_APPLICATION', payload: updatedApplication });
      toast.success('Application updated successfully!');
      return updatedApplication;
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application. Please try again.');
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get a job by ID from Supabase
  const getJobById = async (id: string): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return {
        ...data,
        id: data.id,
        postedDate: data.posted_date,
        deadline: data.deadline,
        logo: data.logo || '/placeholder.svg',
        featured: data.featured || false,
        type: data.type as 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote',
      } as Job;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  };

  // Get applications for a specific job
  const getApplicationsForJob = (jobId: string) => {
    return state.applications.filter(app => app.jobId === jobId);
  };

  // Context value
  const value = {
    state,
    setJobs: (jobs: Job[]) => dispatch({ type: 'SET_JOBS', payload: jobs }),
    fetchJobs,
    addJob,
    updateJob,
    deleteJob,
    setFilter: (filter: JobFilters) => dispatch({ type: 'SET_FILTER', payload: filter }),
    clearFilter: () => dispatch({ type: 'CLEAR_FILTER' }),
    fetchApplications,
    addApplication,
    updateApplication,
    getJobById,
    getApplicationsForJob
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

// Hook for using the job context
export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
