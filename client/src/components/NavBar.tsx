import { LogOut } from './LogOut';
// <<<<<<< create-an-entry
// import { Link, Outlet } from 'react-router-dom';
// =======
// import { Outlet } from 'react-router-dom';
// >>>>>>> main

export function NavBar() {
  return (
    <>
      <header className="purple-background">
        <div className="container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <h1 className="white-text">Trip Journal</h1>
              <Link to="/trips" className="entries-link white-text">
                <h3>Entries nb</h3>
              </Link>
              <Link to="/trips/new" className="entries-link white-text">
                <h3>New Entry nb</h3>
              </Link>
              <Link to="sign-in" className="entries-link white-text">
                <h3>Sign-in navbar.tsx</h3>
              </Link>
              <Link to="sign-up" className="entries-link white-text">
                <h3>Sign-up navbar</h3>
              </Link>
            </div>
          </div>
        </div>
      </header>

<!--       <nav>

      <Outlet />
    </>
  );
}
