import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { IoMdGlobe } from 'react-icons/io';

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

  const handleGlobeClick = () => {
    setShowSignIn(true); // Show the Sign In button and header again when the globe is clicked
    navigate('/'); // Navigate back to the main page (home page)
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-center bg-no-repeat p-6 bg-[url('../public/mobileLogin.jpg')] md:bg-[url('../public/mountain.jpg')]">
      <Link to="/" onClick={handleGlobeClick}>
        <IoMdGlobe className="absolute top-4 left-4 text-white text-3xl" />
      </Link>
      {/* Conditionally render headers and Sign In button */}
      {showSignIn && (
        <div className="text-center max-w-lg px-4 mb-8">
          <h1 className="text-4xl font-light mb-2 text-white merriweather-regular text-shadow-dark">
            Share Your Global Experiences
          </h1>
        </div>
      )}

      {/* Conditionally render Sign In button */}
      {showSignIn && (
        <div className="flex flex-col items-center space-y-4 w-full max-w-sm mb-6">
          <Link
            to="/sign-in"
            onClick={handleSignInClick}
            className="text-xl caveat-200 px-4 py-1 text-white bg-[#6495ED] hover:bg-[#4f80db] border-2 border-[#4f80db] shadow-xl rounded-full text-center w-40 hover:bg-cornflower-600 transition">
            Sign In
          </Link>
        </div>
      )}

      {/* Create an Account Link */}
      <div className="fixed bottom-6 w-full text-center">
        <Link
          to="/sign-up"
          className="font-light px-6 py-3 text-white rounded-md text-center w-48 hover:text-blue-700 transition"
          onClick={handleCreateAccountClick}>
          Create an Account
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
