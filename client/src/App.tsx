import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { NavBar } from './components/NavBar';
import { UserProvider } from './components/UserContext';
import { EntryList } from './pages/EntryList';
import { TripEntryForm } from './pages/TripEntryForm';
import './App.css';

export default function App() {
  return (
    <UserProvider>
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
    </UserProvider>
  );
}
