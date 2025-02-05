import { Link, Outlet } from 'react-router-dom';
import { LogOut } from '../components/LogOut';

export function Home() {
  return (
    <>
      <header className="purple-background">
        <div className="container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <h1 className="white-text">Trip Journal</h1>
              <Link to="/trips" className="entries-link black-text">
                <h3>Entries hm</h3>
              </Link>
              <Link to="/details/new" className="entries-link black-text">
                <h3>New Entry hm</h3>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <nav>
        <Link to="/" className="nav-link">
          <h3>Home hm</h3>
        </Link>
        <Link to="/dashboard" className="nav-link">
          <h3>Dashboard hm</h3>
        </Link>
        <LogOut />
      </nav>

      <Outlet />
    </>
  );
}
