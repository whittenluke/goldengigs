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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/search" element={<SearchPage />} />
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