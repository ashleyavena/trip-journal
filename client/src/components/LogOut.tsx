import { useNavigate } from 'react-router-dom';

export function LogOut() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:8080/api/auth/sign-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    localStorage.removeItem('token');
    navigate('/sign-in');
  };
  return (
    <button
      onClick={handleLogout}
      style={{ padding: '10px', background: 'red', color: 'white' }}>
      Log Out
    </button>
  );
}
