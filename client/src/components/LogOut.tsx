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
            className="log-out
            py-2 px-4 border-2
            border-white text-white
            bg-transparent rounded-full
             cursor-pointer transition-all
             duration-300 ease-in-out
             hover:text-black
              hover:border-black"
            onClick={() => {
              handleSignOut();
              navigate('/');
            }}>
            Log Out
          </button>
        </div>
      )}
    </>
  );
}
