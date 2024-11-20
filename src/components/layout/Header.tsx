import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/auth';

export function Header() {
  const { user, userDetails, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('handleSignOut called');
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderAuthButtons = () => {
    if (!user) {
      return (
        <>
          <Link to="/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </>
      );
    }

    // Show different options based on user type
    if (userDetails?.user_type === 'employer') {
      return (
        <>
          <Link to="/employer/jobs/post">
            <Button variant="primary">Post a Job</Button>
          </Link>
          <Link to="/employer/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      );
    }

    // JobSeeker options
    return (
      <>
        <Link to="/saved-jobs">
          <Button variant="secondary">Saved Jobs</Button>
        </Link>
        <Link to="/applications">
          <Button variant="secondary">My Applications</Button>
        </Link>
        <Button variant="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </>
    );
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-[#6C2BD9] text-2xl font-bold">GoldenGigs</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="tertiary">Find Jobs</Button>
            </Link>
            {renderAuthButtons()}
          </div>
        </div>
      </nav>
    </header>
  );
}