import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { NavBar } from './components/NavBar';
import { UserProvider } from './components/UserContext';

export function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

// import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';
// import { Router } from 'react-router-dom';
// import { BrowserRouter } from 'react-router-dom';

// export default function App() {
//   const [serverData, setServerData] = useState('');

//   useEffect(() => {
//     async function readServerData() {
//       const resp = await fetch('/api/hello');
//       const data = await resp.json();

//       console.log('Data from server:', data);

//       setServerData(data.message);
//     }

//     readServerData();
//   }, []);

//   return (
//     <>
//       {/* <Router> */}
//       <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
//         <img src={viteLogo} className="logo" alt="Vite logo" />
//       </a>
//       <a href="https://react.dev" target="_blank" rel="noreferrer">
//         <img src={reactLogo} className="logo react" alt="React logo" />
//       </a>
//       {/* </Router> */}
//       <h1>{serverData}</h1>
//     </>
//   );
// }
