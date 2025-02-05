import { Link, Outlet } from 'react-router-dom';

export function GetStarted() {
  return (
    <div className="get-started-bg flex flex-col items-center justify-between h-screen w-screen bg-cover bg-center bg-no-repeat p-6 sm:bg-[url('../public/mobileLogin.jpg')]">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Share Your Global Experiences
        </h1>
        <p className="text-lg mb-6 text-white">
          Start documenting your journeys today!
        </p>
      </div>

      {/* Sign In Button */}
      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <Link
          to="/sign-in"
          className="sign-in-button px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-md text-center hover:bg-blue-600 hover:text-white transition">
          Sign In
        </Link>
      </div>

      {/* Create an Account Button at the Bottom */}
      <div className="flex justify-center w-full pb-6">
        <Link
          to="/sign-up"
          className="sign-up-button px-6 py-3 bg-blue-600 text-white rounded-md text-center w-48">
          Create an Account
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
