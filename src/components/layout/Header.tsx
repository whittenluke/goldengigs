import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/auth';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">GoldenGigs</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="tertiary">Find Jobs</Button>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
                <Button variant="secondary" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}