import { LogOut } from './LogOut';

export function NavBar() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>"
        <LogOut />
      </nav>
    </>
  );
}
