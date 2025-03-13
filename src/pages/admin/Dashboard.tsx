
import React, { useState } from 'react';
import { SEO } from '@/utils/seo';
import { useJobContext } from '@/context/JobContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BriefcaseBusiness, Users, BarChart2, ChevronUp, Briefcase, Clock } from 'lucide-react';

// Sample data for dashboard stats
const applicationsByStatus = [
  { status: 'Pending', value: 24 },
  { status: 'Reviewed', value: 13 },
  { status: 'Interviewed', value: 8 },
  { status: 'Hired', value: 3 },
  { status: 'Rejected', value: 6 }
];

const applicationsTrend = [
  { month: 'Jan', applications: 15 },
  { month: 'Feb', applications: 20 },
  { month: 'Mar', applications: 25 },
  { month: 'Apr', applications: 22 },
  { month: 'May', applications: 30 },
  { month: 'Jun', applications: 28 },
  { month: 'Jul', applications: 32 },
  { month: 'Aug', applications: 35 },
  { month: 'Sep', applications: 40 }
];

const jobsByType = [
  { type: 'Full-time', count: 18 },
  { type: 'Part-time', count: 8 },
  { type: 'Contract', count: 5 },
  { type: 'Internship', count: 4 },
  { type: 'Remote', count: 15 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const { state } = useJobContext();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate stats
  const totalJobs = state.jobs.length;
  const totalApplications = applicationsByStatus.reduce((acc, curr) => acc + curr.value, 0);
  const totalHired = applicationsByStatus.find(a => a.status === 'Hired')?.value || 0;
  const pendingApplications = applicationsByStatus.find(a => a.status === 'Pending')?.value || 0;

  // Recent activity items
  const recentActivity = [
    { id: 1, type: 'application', user: 'Sophia Rodriguez', action: 'submitted an application for', target: 'Senior Developer', time: '2 hours ago' },
    { id: 2, type: 'job', user: 'Admin', action: 'posted a new job', target: 'UI/UX Designer', time: '5 hours ago' },
    { id: 3, type: 'application', user: 'Jackson Lee', action: 'was hired for', target: 'Marketing Specialist', time: '1 day ago' },
    { id: 4, type: 'application', user: 'Emma Watson', action: 'was interviewed for', target: 'Product Manager', time: '2 days ago' },
    { id: 5, type: 'job', user: 'Admin', action: 'updated the job posting for', target: 'Software Engineer', time: '3 days ago' }
  ];

  return (
    <>
      <SEO 
        title="Admin Dashboard" 
        description="JobHub administration dashboard for managing jobs and applications."
      />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalJobs}</div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" /> 12% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalApplications}</div>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" /> 8% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Candidates Hired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalHired}</div>
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" /> 2% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{pendingApplications}</div>
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Require your review
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={applicationsByStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applications Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={applicationsTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="applications" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {applicationsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Jobs by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={jobsByType}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 110,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0 border-border">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'application' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {activity.type === 'application' ? 
                      <Users className="h-4 w-4" /> : 
                      <Briefcase className="h-4 w-4" />
                    }
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
