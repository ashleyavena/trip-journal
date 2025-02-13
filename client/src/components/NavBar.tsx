import { LogOut } from './LogOut';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaGlobe } from 'react-icons/fa';
import { FaPowerOff } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function NavBar() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/sign-in', '/sign-up'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const { handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      {!shouldHideNavbar && (
        <header className="bg-black fixed top-0 w-full z-50 shadow-md">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <a href="/trips">
                <h1 className="font-serif text-white text-lg font-bold">
                  Travelogue
                </h1>
              </a>
              <div
                className="block md:hidden text-white text-xl cursor-pointer"
                onClick={() => {
                  handleSignOut();
                  navigate('/');
                }}>
                <FaPowerOff />
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/details/new"
                  className="entries-link text-white hover:underline text-lg ysabeau-sc-200">
                  New Entry
                </Link>
                <Link
                  to="/map"
                  className="entries-link text-white hover:underline ysabeau-sc-200">
                  Map
                </Link>
                <Link
                  to="/trips"
                  className="entries-link text-white hover:underline ysabeau-sc-200">
                  Entries
                </Link>
                <LogOut />
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Bottom Navbar ( mobile) */}
      {!shouldHideNavbar && (
        <div className="fixed bottom-0 w-full  bg-opacity-5 z-50 shadow-md md:hidden backdrop-blur-md">
          <div className="container mx-auto flex justify-around py-3">
            <Link
              to="/trips"
              className="text-white text-2xl shadow-sm rounded-full shadow-black">
              <FaHome />
            </Link>
            <Link
              to="/details/new"
              className="text-white text-2xl shadow-sm rounded-full shadow-black ">
              <FaPlus />
            </Link>
            <Link
              to="/map"
              className="text-white text-2xl shadow-sm rounded-full  shadow-black">
              <FaGlobe />
            </Link>
          </div>
        </div>
      )}

      {/* prevent content from hiding behind navbar */}
      <div className={shouldHideNavbar ? '' : 'pt-20'}>
        <Outlet />
      </div>
    </>
  );
}
