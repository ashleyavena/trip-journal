import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function LogOut() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      {user && (
        <div className="relative flex-grow flex-1 px-4">
          <button
            style={{ padding: '10px', background: 'pink', color: 'black' }}
            onClick={() => {
              handleSignOut();
              navigate('/');
            }}>
            Log Out nb
          </button>
        </div>
      )}
    </>
  );
}
