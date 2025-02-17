import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { IoMdGlobe } from 'react-icons/io';
import { useUser } from '../components/useUser';

export function GetStarted() {
  const [showSignIn, setShowSignIn] = useState(true);
  const navigate = useNavigate();
  const { handleSignIn } = useUser();

  const handleSignInClick = () => {
    setShowSignIn(false);
    navigate('/sign-in');
  };

  const handleCreateAccountClick = () => {
    setShowSignIn(false);
  };

  const handleGlobeClick = () => {
    setShowSignIn(true);
    navigate('/');
  };

  async function handleGuestAccountClick() {
    try {
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ashleyavena',
          password: 'cherry',
        }),
      };
      const response = await fetch('/api/auth/sign-in', req);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `fetch error ${response.status}`);
      }
      const { user, token } = await response.json();
      handleSignIn(user, token);
      navigate('/trips', { replace: true });
    } catch (error) {
      alert(`Error signing in ${error}`);
    }
  }

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

      <div>
        <div
          className="font-light px-6 py-3 text-white rounded-md text-center w-48 hover:text-blue-700 transition cursor-pointer"
          onClick={handleGuestAccountClick}>
          Continue as Guest
        </div>
      </div>

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
