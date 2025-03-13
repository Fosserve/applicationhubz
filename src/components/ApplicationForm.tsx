
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { CustomButton } from './ui/custom-button';
import { useJobContext } from '@/context/JobContext';
import { Job, Application } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationFormProps {
  job: Job;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ job }) => {
  const { currentUser } = useAuth();
  const { addApplication } = useJobContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    resume: '',
    coverLetter: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setFormData(prev => ({ ...prev, resume: file.name }));
      
      if (errors.resume) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.resume;
          return newErrors;
        });
      }
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!resumeFile && !formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let resumeUrl = '';
      
      // Upload resume file to Supabase Storage
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Check if resumes bucket exists first
        const { data: buckets } = await supabase.storage.listBuckets();
        const resumesBucketExists = buckets?.some(bucket => bucket.name === 'resumes');
        
        // Create a resumes bucket if it doesn't exist
        if (!resumesBucketExists) {
          const { error: storageError } = await supabase.storage.createBucket('resumes', {
            public: false
          });
          
          if (storageError) {
            throw storageError;
          }
        }
        
        const { data, error } = await supabase.storage
          .from('resumes')
          .upload(filePath, resumeFile);
        
        if (error) {
          throw error;
        }
        
        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath);
        
        resumeUrl = urlData.publicUrl;
      }
      
      // Create the application in Supabase
      const newApplication: Omit<Application, 'id' | 'submittedAt'> = {
        jobId: job.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        resume: resumeUrl || formData.resume,
        coverLetter: formData.coverLetter,
        status: 'Pending',
        userId: currentUser?.id
      };
      
      const application = await addApplication(newApplication);
      
      if (application) {
        toast.success('Application submitted successfully!');
        navigate(`/application-success/${job.id}`);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-border transition-all duration-300">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.fullName ? 'border-destructive' : 'border-input'
          } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-destructive flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.fullName}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.email ? 'border-destructive' : 'border-input'
          } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.phone ? 'border-destructive' : 'border-input'
          } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-destructive flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="resume" className="block text-sm font-medium mb-1">
          Resume
        </label>
        <div className={`relative border ${
          errors.resume ? 'border-destructive' : 'border-input'
        } rounded-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="sr-only"
          />
          <label
            htmlFor="resume"
            className="flex items-center justify-between px-4 py-2 cursor-pointer"
          >
            <span className={`${resumeFile ? '' : 'text-muted-foreground'}`}>
              {resumeFile ? resumeFile.name : 'Upload your resume (PDF, DOC, DOCX)'}
            </span>
            <CustomButton type="button" variant="secondary" size="sm">
              <Upload className="h-4 w-4 mr-1" /> Browse
            </CustomButton>
          </label>
        </div>
        {errors.resume && (
          <p className="mt-1 text-sm text-destructive flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.resume}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum file size: 5MB
        </p>
      </div>
      
      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
          Cover Letter (Optional)
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Tell us why you're a good fit for this position..."
        ></textarea>
      </div>
      
      <div>
        <CustomButton type="submit" className="w-full" isLoading={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </CustomButton>
      </div>
    </form>
  );
};

export default ApplicationForm;
