import { LogOut } from './LogOut';
import { Outlet } from 'react-router-dom';

export function NavBar() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>"<a href="/sign-up">Sign Up</a>
        <a href="/sign-in">Sign In</a>
        <LogOut />
      </nav>
      <Outlet />
    </>
  );
}
