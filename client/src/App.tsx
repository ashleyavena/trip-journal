import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { UserProvider } from './components/UserContext';
import { EntryList } from './pages/EntryList';
import { TripEntryForm } from './pages/TripEntryForm';
import './App.css';
import { GetStarted } from './pages/GetStarted';
import { NavBar } from './components/NavBar';
import { UploadWrapper } from './components/UploadWrapper';
import { TripDetailsPage } from './pages/TripDetailsPage';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<GetStarted />}>
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        </Route>
        <Route path="/home" element={<Home />} />
        <Route path="/navBar" element={<NavBar />} />
        <Route path="/details/:tripId" element={<TripEntryForm />} />
        <Route path="/uploadImages/:tripId" element={<UploadWrapper />} />
        <Route path="/trip/:tripId" element={<TripDetailsPage />} />{' '}
        {/*
            <Route path="details/:entryId" element={<EntryList />} /> */}
        <Route path="/trips" element={<EntryList />} />
        {/* <Route path="/trips/new" element={<div>New Trip Form</div>} /> */}
        {/* <Route path="/details/:tripId" element={<div>Trip Details</div>} /> */}
      </Routes>
    </UserProvider>
  );
}
