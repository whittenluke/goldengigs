import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { SearchPage } from './pages/jobs/SearchPage';
import { EmployerProfilePage } from './pages/profile/EmployerProfile';
import { JobSeekerProfileEditor } from './pages/profile/JobSeekerProfileEditor';
import { CreateJobPage } from './pages/jobs/CreateJobPage';
import { ManageJobsPage } from './pages/jobs/ManageJobsPage';
import { EmployerDashboard } from './pages/employer/Dashboard';
import { ApplicationsPage } from './pages/employer/Applications';
import { Toast } from './components/ui/Toast';
import { JobDetailPage } from './pages/jobs/JobDetailPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toast />
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute userType="jobseeker">
                      <JobSeekerProfileEditor mode="edit" />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employer/profile" 
                  element={
                    <ProtectedRoute userType="employer">
                      <EmployerProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile/create" 
                  element={
                    <ProtectedRoute userType="jobseeker">
                      <JobSeekerProfileEditor mode="create" />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employer/jobs/create" 
                  element={
                    <ProtectedRoute userType="employer">
                      <CreateJobPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employer/jobs" 
                  element={
                    <ProtectedRoute userType="employer">
                      <ManageJobsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employer/dashboard" 
                  element={
                    <ProtectedRoute userType="employer">
                      <EmployerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employer/applications" 
                  element={
                    <ProtectedRoute userType="employer">
                      <ApplicationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;