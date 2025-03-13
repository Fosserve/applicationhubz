
import React, { useState } from 'react';
import { SEO } from '@/utils/seo';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/custom-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Job } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useJobContext } from '@/context/JobContext';
import { Plus, Edit, Trash, Search } from 'lucide-react';

const ManageJobs: React.FC = () => {
  const { jobs, addJob, updateJob, removeJob } = useJobContext();
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
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    const jobId = `job-${Date.now()}`;
    const jobToAdd = {
      ...newJob,
      id: jobId,
      requirements: newJob.requirements || [],
      responsibilities: newJob.responsibilities || [],
      benefits: newJob.benefits || [],
    } as Job;
    
    addJob(jobToAdd);
    toast({
      title: "Job Added",
      description: `${jobToAdd.title} at ${jobToAdd.company} has been added.`,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJob) return;
    
    updateJob(currentJob.id, currentJob);
    toast({
      title: "Job Updated",
      description: `${currentJob.title} at ${currentJob.company} has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteJob = (jobId: string) => {
    removeJob(jobId);
    toast({
      title: "Job Deleted",
      description: "The job listing has been removed.",
      variant: "destructive"
    });
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
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
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
              <DialogContent className="sm:max-w-[600px]">
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
          {filteredJobs.length > 0 ? (
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
        <DialogContent className="sm:max-w-[600px]">
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
