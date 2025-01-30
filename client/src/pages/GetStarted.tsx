import { Link, Outlet } from 'react-router-dom';
// import { useUser } from '../components/useUser';

export function GetStarted() {
  // const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Trip Journal</h1>
      <p className="text-lg mb-6">Start documenting your journeys today!</p>

      <div className="space-x-4">
        <Link
          to="/sign-up"
          className="px-6 py-2 bg-blue-600 text-white rounded-md">
          Sign Up
        </Link>
        <div>
          <Link
            to="/sign-in"
            className="px-6 py-2 bg-gray-600 text-white rounded-md">
            Sign In
          </Link>
        </div>
      </div>

      {/* {!user && (
        <div className="mt-6">
          <Link
            to="/app/home"
            className="px-6 py-2 bg-blue-600 text-white rounded-md">
            Go to Home
          </Link>
        </div>
      )} */}

      <Outlet />
    </div>
  );
}
