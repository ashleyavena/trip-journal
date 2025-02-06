import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export function GetStarted() {
  const [showSignIn, setShowSignIn] = useState(true); // State to toggle Sign In button visibility
  const navigate = useNavigate();

  const handleSignInClick = () => {
    setShowSignIn(false); // Hide Sign In button when clicked
    navigate('/sign-in'); // Redirect to Login page
  };

  const handleCreateAccountClick = () => {
    setShowSignIn(false); // Hide Sign In button when Create Account is clicked
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-center bg-no-repeat p-6 bg-[url('../public/mobileLogin.jpg')] md:bg-[url('../public/mountain.jpg')]">
      {/* Conditionally render headers and Sign In button */}
      {showSignIn && (
        <div className="text-center max-w-lg px-4 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Share Your Global Experiences
          </h1>
          <p className="text-lg mb-6 text-white">
            Start documenting your journeys today!
          </p>
        </div>
      )}

      {/* Conditionally render Sign In button */}
      {showSignIn && (
        <div className="flex flex-col items-center space-y-4 w-full max-w-sm mb-6">
          <Link
            to="/sign-in"
            onClick={handleSignInClick} // Hide Sign In button when clicked
            className="px-6 py-3 text-white bg-blue-600 rounded-md text-center w-48 hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      )}

      {/* Create an Account Link */}
      <div className="fixed bottom-6 w-full text-center">
        <Link
          to="/sign-up"
          className="px-6 py-3 text-white rounded-md text-center w-48 hover:text-blue-700 transition"
          onClick={handleCreateAccountClick}>
          Create an Account
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
