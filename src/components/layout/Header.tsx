import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/auth';

export function Header() {
  const { user, signOut, userDetails } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <Link to={userDetails?.user_type === 'employer' ? '/employer/profile' : '/profile'}>
            <Button variant="tertiary">Profile</Button>
          </Link>
          <Button 
            variant="secondary" 
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <>
        <Link to="/login">
          <Button variant="tertiary">Log In</Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary">Sign Up</Button>
        </Link>
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