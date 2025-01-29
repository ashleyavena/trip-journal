import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { NavBar } from './components/NavBar';
import { UserProvider } from './components/UserContext';
import { EntryList } from './pages/EntryList';

import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import { TripEntryForm } from './pages/TripEntryForm';
// import { Router } from 'react-router-dom';
// import { BrowserRouter } from 'react-router-dom';

export default function App() {
  const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function readServerData() {
      const resp = await fetch('/api/hello');
      const data = await resp.json();

      console.log('Data from server:', data);

      setServerData(data.message);
    }

    readServerData();
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<Home />} />
            <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
            <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            <Route path="/details/:tripId" element={<TripEntryForm />} />
            {/*
            <Route path="details/:entryId" element={<EntryList />} /> */}

            <Route path="/trips" element={<EntryList />} />
            {/* <Route path="/trips/new" element={<div>New Trip Form</div>} /> */}
            {/* <Route path="/details/:tripId" element={<div>Trip Details</div>} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      {/*
      <div className="logos-container">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}

      <h1>{serverData}</h1>
    </UserProvider>
  );
}
