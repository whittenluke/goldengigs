import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Experience Matters
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect with companies that value your decades of expertise. Find flexible, meaningful work opportunities that fit your lifestyle.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/signup">
                <Button size="lg">Start Your Journey</Button>
              </Link>
              <Link to="/search">
                <Button variant="secondary" size="lg">Browse Jobs</Button>
              </Link>
            </div>
          </div>
          
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
                alt="App screenshot"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}