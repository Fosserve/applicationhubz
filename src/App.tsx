
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobDetails from "./pages/JobDetails";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageJobs from "./pages/admin/ManageJobs";
import Applications from "./pages/admin/Applications";
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import { JobProvider } from "./context/JobContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <JobProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/application-success/:jobId" element={<ApplicationSuccess />} />
                <Route path="/login" element={<Login />} />
              </Route>
              
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<ManageJobs />} />
                <Route path="applications" element={<Applications />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </JobProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
