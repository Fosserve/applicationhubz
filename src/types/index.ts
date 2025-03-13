
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  logo?: string;
  featured?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  status: 'Pending' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected';
  submittedAt: string;
  notes?: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'applicant';
}

export interface JobFilters {
  type?: string[];
  location?: string[];
  keyword?: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}
