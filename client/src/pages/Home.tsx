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
              <Link to="/trips" className="entries-link white-text">
                <h3>Entries hm</h3>
              </Link>
              <Link to="/trips/new" className="entries-link white-text">
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

// export function Home() {
//   const { user } = useUser();
//   const navigate = useNavigate();

//   return (
//     <div className="container m-4">
//       <div className="flex flex-wrap mb-4">
//         {!user && (
//           <>
//             <div className="relative flex-grow flex-1 px-4">
//               <button
//                 className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
//                 onClick={() => navigate('sign-up')}>
//                 Sign Up Home.tsx
//               </button>
//             </div>
//             <div className="relative flex-grow flex-1 px-4">
//               <button
//                 className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
//                 onClick={() => navigate('sign-in')}>
//                 Sign In Home.tsx
//               </button>
//             </div>
//           </>
//         )}
//         {/* {user && (
//           <div className="relative flex-grow flex-1 px-4">
//             <button
//               style={{ padding: '10px', background: 'red', color: 'white' }}
//               onClick={() => {
//                 handleSignOut();
//                 navigate('/');
//               }}>
//               Log Out home.tsx
//             </button>
//           </div>
//         )} */}
//       </div>
//       {user && (
//         <p className="py-2">
//           Signed in as {user.username} with ID: {user.userId}
//         </p>
//       )}
//       {!user && <p>Not signed in</p>}
//       {/* {user && <Todos />} */}
//     </div>
//   );
// }
