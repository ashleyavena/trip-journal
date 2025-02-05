import { LogOut } from './LogOut';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaGlobe } from 'react-icons/fa'; // Importing React Icons

export function NavBar() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/sign-in', '/sign-up'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* Full navbar (hidden on mobile) */}
      {!shouldHideNavbar && (
        <header className="bg-purple-700 fixed top-0 w-full z-50 shadow-md">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              {/* Logo / Title */}
              <h1 className="text-white text-lg font-bold">Trip Journal</h1>

              {/* Navigation Links (hidden on mobile) */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/details/new"
                  className="entries-link text-white hover:underline">
                  New Entry
                </Link>
                <Link to="/map" className="text-white hover:underline">
                  Map
                </Link>
                <Link
                  to="/trips"
                  className="entries-link text-white hover:underline">
                  Entries
                </Link>
                <LogOut />
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Bottom Navbar (Visible on mobile) */}
      {!shouldHideNavbar && (
        <div className="fixed bottom-0 w-full bg-purple-700 z-50 shadow-md md:hidden">
          <div className="container mx-auto flex justify-around py-3">
            {/* Home Icon */}
            <Link to="/trips" className="text-white text-2xl">
              <FaHome />
            </Link>

            {/* New Entry Icon */}
            <Link to="/details/new" className="text-white text-2xl">
              <FaPlus />
            </Link>

            {/* Map Icon */}
            <Link to="/map" className="text-white text-2xl">
              <FaGlobe />
            </Link>
          </div>
        </div>
      )}

      {/* Prevent content from hiding behind navbar */}
      <div className={shouldHideNavbar ? '' : 'pt-20'}>
        <Outlet />
      </div>
    </>
  );
}
