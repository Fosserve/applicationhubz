
import React, { useState, useEffect } from 'react';
import { SEO } from '@/utils/seo';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/custom-button';
import { Application, Job } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useJobContext } from '@/context/JobContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText } from 'lucide-react';

const Applications: React.FC = () => {
  const { state, fetchApplications, updateApplication } = useJobContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Application['status']>('Pending');

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = state.applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (application: Application, newStatus: Application['status']) => {
    try {
      const updatedApplication = { ...application, status: newStatus };
      await updateApplication(updatedApplication);
      setViewingApplication(null);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getJobTitle = (jobId: string): string => {
    const job = state.jobs.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const getJobCompany = (jobId: string): string => {
    const job = state.jobs.find(j => j.id === jobId);
    return job ? job.company : 'Unknown Company';
  };

  return (
    <>
      <SEO 
        title="Applications" 
        description="Review and manage job applications on JobHub."
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Applications</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search applicants..."
                className="pl-10 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          {state.loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading applications...</div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">Applicant</th>
                    <th className="text-left p-4 font-medium">Job</th>
                    <th className="text-left p-4 font-medium">Company</th>
                    <th className="text-left p-4 font-medium">Submitted</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="border-t border-border">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{application.fullName}</div>
                          <div className="text-sm text-muted-foreground">{application.email}</div>
                        </div>
                      </td>
                      <td className="p-4">{getJobTitle(application.jobId)}</td>
                      <td className="p-4">{getJobCompany(application.jobId)}</td>
                      <td className="p-4">{new Date(application.submittedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'Interviewed' ? 'bg-purple-100 text-purple-800' :
                          application.status === 'Hired' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <CustomButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewingApplication(application)}
                          className="text-primary"
                        >
                          <FileText className="h-4 w-4 mr-1" /> View
                        </CustomButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || statusFilter ? "No applications match your search criteria" : "No applications have been received yet."}
            </div>
          )}
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!viewingApplication} onOpenChange={(open) => !open && setViewingApplication(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {viewingApplication && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Applicant</h3>
                  <p className="font-medium">{viewingApplication.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Applied For</h3>
                  <p className="font-medium">{getJobTitle(viewingApplication.jobId)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <p>{viewingApplication.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                  <p>{viewingApplication.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted On</h3>
                  <p>{new Date(viewingApplication.submittedAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      viewingApplication.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      viewingApplication.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                      viewingApplication.status === 'Interviewed' ? 'bg-purple-100 text-purple-800' :
                      viewingApplication.status === 'Hired' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {viewingApplication.status}
                    </span>
                  </div>
                </div>
              </div>

              {viewingApplication.resume && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Resume</h3>
                  <div className="p-4 bg-muted/30 rounded-md text-sm">
                    <a 
                      href={viewingApplication.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </a>
                  </div>
                </div>
              )}

              {viewingApplication.coverLetter && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Cover Letter</h3>
                  <div className="p-4 bg-muted/30 rounded-md text-sm">
                    {viewingApplication.coverLetter}
                  </div>
                </div>
              )}

              {viewingApplication.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <div className="p-4 bg-muted/30 rounded-md text-sm">
                    {viewingApplication.notes}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Application['status'])}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  
                  <CustomButton
                    onClick={() => handleStatusChange(viewingApplication, selectedStatus)}
                    className="ml-2"
                  >
                    Update Status
                  </CustomButton>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <CustomButton variant="outline" onClick={() => setViewingApplication(null)}>
                  Close
                </CustomButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Applications;
