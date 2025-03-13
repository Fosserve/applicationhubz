
import React, { useState, useEffect } from 'react';
import { SEO } from '@/utils/seo';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/custom-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Job } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useJobContext } from '@/context/JobContext';
import { Plus, Edit, Trash, Search } from 'lucide-react';

const ManageJobs: React.FC = () => {
  const { state, addJob, updateJob, deleteJob, fetchJobs } = useJobContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: [],
    responsibilities: [],
    benefits: [],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // For form text inputs that need to be converted to arrays
  const [requirementsText, setRequirementsText] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = state.jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert string requirements to array
      const requirementsArray = requirementsText
        .split('\n')
        .filter(item => item.trim() !== '');
      
      // Convert string responsibilities to array
      const responsibilitiesArray = responsibilitiesText
        .split('\n')
        .filter(item => item.trim() !== '');
      
      // Convert string benefits to array
      const benefitsArray = benefitsText
        .split('\n')
        .filter(item => item.trim() !== '');
      
      const jobToAdd = {
        ...newJob,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        benefits: benefitsArray,
      } as Omit<Job, 'id'>;
      
      await addJob(jobToAdd);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding job:', error);
      toast({
        title: "Error",
        description: "Failed to add job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJob) return;
    
    try {
      // No need for conversion here as we're handling arrays directly in the currentJob state
      await updateJob(currentJob);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(jobId);
    }
  };

  const resetForm = () => {
    setNewJob({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: [],
      responsibilities: [],
      benefits: [],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    setRequirementsText('');
    setResponsibilitiesText('');
    setBenefitsText('');
  };

  const editJob = (job: Job) => {
    setCurrentJob(job);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <SEO 
        title="Manage Jobs" 
        description="Manage job listings on JobHub."
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Jobs</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <CustomButton className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Job
                </CustomButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Job</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddJob} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Job Title</label>
                      <Input
                        id="title"
                        required
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">Company</label>
                      <Input
                        id="company"
                        required
                        value={newJob.company}
                        onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">Location</label>
                      <Input
                        id="location"
                        required
                        value={newJob.location}
                        onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">Job Type</label>
                      <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newJob.type}
                        onChange={(e) => setNewJob({...newJob, type: e.target.value as any})}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="salary" className="text-sm font-medium">Salary</label>
                      <Input
                        id="salary"
                        required
                        value={newJob.salary}
                        onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                      <Input
                        id="deadline"
                        type="date"
                        required
                        value={new Date(newJob.deadline || '').toISOString().split('T')[0]}
                        onChange={(e) => setNewJob({...newJob, deadline: new Date(e.target.value).toISOString()})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                      id="description"
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newJob.description}
                      onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="requirements" className="text-sm font-medium">Requirements (one per line)</label>
                    <textarea
                      id="requirements"
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={requirementsText}
                      onChange={(e) => setRequirementsText(e.target.value)}
                      placeholder="Enter each requirement on a new line"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="responsibilities" className="text-sm font-medium">Responsibilities (one per line)</label>
                    <textarea
                      id="responsibilities"
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={responsibilitiesText}
                      onChange={(e) => setResponsibilitiesText(e.target.value)}
                      placeholder="Enter each responsibility on a new line"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="benefits" className="text-sm font-medium">Benefits (one per line)</label>
                    <textarea
                      id="benefits"
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={benefitsText}
                      onChange={(e) => setBenefitsText(e.target.value)}
                      placeholder="Enter each benefit on a new line"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <CustomButton
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton type="submit">Add Job</CustomButton>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          {state.loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading jobs...</div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Company</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Posted Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-t border-border">
                      <td className="p-4">{job.title}</td>
                      <td className="p-4">{job.company}</td>
                      <td className="p-4">{job.location}</td>
                      <td className="p-4">{job.type}</td>
                      <td className="p-4">{new Date(job.postedDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editJob(job)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            aria-label="Edit job"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            aria-label="Delete job"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? "No jobs match your search criteria" : "No jobs have been created yet. Add your first job listing."}
            </div>
          )}
        </div>
      </div>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {currentJob && (
            <form onSubmit={handleEditJob} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">Job Title</label>
                  <Input
                    id="edit-title"
                    required
                    value={currentJob.title}
                    onChange={(e) => setCurrentJob({...currentJob, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-company" className="text-sm font-medium">Company</label>
                  <Input
                    id="edit-company"
                    required
                    value={currentJob.company}
                    onChange={(e) => setCurrentJob({...currentJob, company: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-location" className="text-sm font-medium">Location</label>
                  <Input
                    id="edit-location"
                    required
                    value={currentJob.location}
                    onChange={(e) => setCurrentJob({...currentJob, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-type" className="text-sm font-medium">Job Type</label>
                  <select
                    id="edit-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentJob.type}
                    onChange={(e) => setCurrentJob({...currentJob, type: e.target.value as any})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-salary" className="text-sm font-medium">Salary</label>
                  <Input
                    id="edit-salary"
                    required
                    value={currentJob.salary}
                    onChange={(e) => setCurrentJob({...currentJob, salary: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-deadline" className="text-sm font-medium">Deadline</label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    required
                    value={new Date(currentJob.deadline).toISOString().split('T')[0]}
                    onChange={(e) => setCurrentJob({...currentJob, deadline: new Date(e.target.value).toISOString()})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                <textarea
                  id="edit-description"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={currentJob.description}
                  onChange={(e) => setCurrentJob({...currentJob, description: e.target.value})}
                ></textarea>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-requirements" className="text-sm font-medium">Requirements (one per line)</label>
                <textarea
                  id="edit-requirements"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={Array.isArray(currentJob.requirements) ? currentJob.requirements.join('\n') : ''}
                  onChange={(e) => {
                    const requirementsArray = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setCurrentJob({...currentJob, requirements: requirementsArray});
                  }}
                  placeholder="Enter each requirement on a new line"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-responsibilities" className="text-sm font-medium">Responsibilities (one per line)</label>
                <textarea
                  id="edit-responsibilities"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={Array.isArray(currentJob.responsibilities) ? currentJob.responsibilities.join('\n') : ''}
                  onChange={(e) => {
                    const responsibilitiesArray = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setCurrentJob({...currentJob, responsibilities: responsibilitiesArray});
                  }}
                  placeholder="Enter each responsibility on a new line"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-benefits" className="text-sm font-medium">Benefits (one per line)</label>
                <textarea
                  id="edit-benefits"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={Array.isArray(currentJob.benefits) ? currentJob.benefits.join('\n') : ''}
                  onChange={(e) => {
                    const benefitsArray = e.target.value.split('\n').filter(line => line.trim() !== '');
                    setCurrentJob({...currentJob, benefits: benefitsArray});
                  }}
                  placeholder="Enter each benefit on a new line"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton type="submit">Update Job</CustomButton>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageJobs;
