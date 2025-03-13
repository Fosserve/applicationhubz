
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Job, Application, JobFilters } from '../types';

// Sample data (in a real app this would come from an API)
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    requirements: [
      'Proficient in React, TypeScript, and modern JS',
      '3+ years of frontend development experience',
      'Experience with responsive design and CSS frameworks'
    ],
    responsibilities: [
      'Develop and maintain user interfaces',
      'Collaborate with designers and backend engineers',
      'Ensure the technical feasibility of UI/UX designs'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Flexible work arrangements'
    ],
    postedDate: '2023-10-15',
    deadline: '2023-11-15',
    logo: '/placeholder.svg',
    featured: true
  },
  {
    id: '2',
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $120,000',
    description: 'Join our design team to create beautiful and intuitive user experiences...',
    requirements: [
      'Portfolio showcasing UX/UI design skills',
      'Experience with Figma, Sketch, or similar tools',
      'Knowledge of user research and testing methodologies'
    ],
    responsibilities: [
      'Create wireframes, prototypes, and user flows',
      'Conduct user research and usability testing',
      'Collaborate with product managers and developers'
    ],
    benefits: [
      'Remote-first company culture',
      'Professional development budget',
      'Flexible working hours'
    ],
    postedDate: '2023-10-20',
    deadline: '2023-11-20',
    logo: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'ServerStack',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    description: 'Seeking an experienced Backend Engineer to build scalable APIs and services...',
    requirements: [
      'Strong knowledge of Node.js, Python, or similar',
      'Experience with database design and optimization',
      'Understanding of cloud infrastructure (AWS/GCP/Azure)'
    ],
    responsibilities: [
      'Design and implement backend services and APIs',
      'Optimize database performance and queries',
      'Ensure security, scalability, and reliability'
    ],
    benefits: [
      'Comprehensive benefits package',
      'Generous PTO policy',
      'Career growth opportunities'
    ],
    postedDate: '2023-10-18',
    deadline: '2023-11-18',
    logo: '/placeholder.svg',
    featured: true
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'ProductLabs',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    description: 'We\'re looking for a product manager to drive product strategy and execution...',
    requirements: [
      '3+ years in product management',
      'Experience with Agile methodologies',
      'Strong analytical and communication skills'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Gather and prioritize requirements',
      'Coordinate product launches and releases'
    ],
    benefits: [
      'Competitive compensation',
      'Health benefits and 401k matching',
      'Flexible work environment'
    ],
    postedDate: '2023-10-25',
    deadline: '2023-11-25',
    logo: '/placeholder.svg'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudWorks',
    location: 'Remote',
    type: 'Contract',
    salary: '$110 - $130 per hour',
    description: 'Looking for a DevOps expert to improve our CI/CD pipelines and infrastructure...',
    requirements: [
      'Experience with CI/CD tools (Jenkins, GitHub Actions, etc.)',
      'Knowledge of container orchestration (Kubernetes)',
      'Infrastructure as Code expertise (Terraform, CloudFormation)'
    ],
    responsibilities: [
      'Implement and maintain CI/CD pipelines',
      'Automate infrastructure provisioning and management',
      'Optimize system reliability and performance'
    ],
    benefits: [
      'Flexible contract terms',
      'Remote work',
      'Opportunity for contract extension'
    ],
    postedDate: '2023-10-22',
    deadline: '2023-11-22',
    logo: '/placeholder.svg'
  }
];

const sampleApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    resume: 'https://example.com/resume.pdf',
    coverLetter: 'I am excited about the opportunity to join your team...',
    status: 'Pending',
    submittedAt: '2023-10-20T14:30:00Z',
    notes: 'Strong React experience, good communication skills'
  },
  {
    id: '2',
    jobId: '1',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    resume: 'https://example.com/resume2.pdf',
    status: 'Reviewed',
    submittedAt: '2023-10-21T10:15:00Z',
    notes: 'Excellent portfolio, 5 years of experience'
  },
  {
    id: '3',
    jobId: '3',
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '555-456-7890',
    resume: 'https://example.com/resume3.pdf',
    coverLetter: 'My background in distributed systems makes me a good fit...',
    status: 'Interviewed',
    submittedAt: '2023-10-19T09:45:00Z'
  }
];

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
        filteredJobs: action.payload
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
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  setFilter: (filter: JobFilters) => void;
  clearFilter: () => void;
  setApplications: (applications: Application[]) => void;
  addApplication: (application: Application) => void;
  updateApplication: (application: Application) => void;
  getJobById: (id: string) => Job | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Provider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  // Initialize with sample data
  useEffect(() => {
    dispatch({ type: 'SET_JOBS', payload: sampleJobs });
    dispatch({ type: 'SET_APPLICATIONS', payload: sampleApplications });
  }, []);

  // Context actions
  const setJobs = (jobs: Job[]) => {
    dispatch({ type: 'SET_JOBS', payload: jobs });
  };

  const addJob = (job: Job) => {
    dispatch({ type: 'ADD_JOB', payload: job });
  };

  const updateJob = (job: Job) => {
    dispatch({ type: 'UPDATE_JOB', payload: job });
  };

  const deleteJob = (id: string) => {
    dispatch({ type: 'DELETE_JOB', payload: id });
  };

  const setFilter = (filter: JobFilters) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  };

  const setApplications = (applications: Application[]) => {
    dispatch({ type: 'SET_APPLICATIONS', payload: applications });
  };

  const addApplication = (application: Application) => {
    dispatch({ type: 'ADD_APPLICATION', payload: application });
  };

  const updateApplication = (application: Application) => {
    dispatch({ type: 'UPDATE_APPLICATION', payload: application });
  };

  const getJobById = (id: string) => {
    return state.jobs.find(job => job.id === id);
  };

  const getApplicationsForJob = (jobId: string) => {
    return state.applications.filter(app => app.jobId === jobId);
  };

  return (
    <JobContext.Provider
      value={{
        state,
        setJobs,
        addJob,
        updateJob,
        deleteJob,
        setFilter,
        clearFilter,
        setApplications,
        addApplication,
        updateApplication,
        getJobById,
        getApplicationsForJob
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Hook for using the job context
export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
