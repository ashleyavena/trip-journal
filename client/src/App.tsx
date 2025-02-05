import { Route, Routes } from 'react-router-dom';
import './App.css';
import { GoogleMaps } from './components/GoogleMaps';
import { NavBar } from './components/NavBar';
import { PinsProvider } from './components/PinsContext';
import { UploadWrapper } from './components/UploadWrapper';
import { UserProvider } from './components/UserContext';
import { AuthPage } from './pages/AuthPage';
import { EntryList } from './pages/EntryList';
import { GetStarted } from './pages/GetStarted';
// import { Home } from './pages/Home';
import { MapPage } from './pages/MapPage'; // MapPage handles map rendering
import { TripDetailsPage } from './pages/TripDetailsPage';
import { TripEntryForm } from './pages/TripEntryForm';

export default function App() {
  return (
    <PinsProvider>
      <GoogleMaps>
        <UserProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<GetStarted />}>
              <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
              <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            </Route>
            {/* <Route path="/home" element={<Home />} /> */}

            <Route path="/map" element={<MapPage />} />

            <Route path="/entry-form" element={<TripEntryForm />} />
            {/* <Route path="/navBar" element={<NavBar />} /> */}
            <Route path="/details/:tripId" element={<TripEntryForm />} />
            <Route path="/uploadImages/:tripId" element={<UploadWrapper />} />
            <Route path="/trip/:tripId" element={<TripDetailsPage />} />
            <Route path="/trips" element={<EntryList />} />
          </Routes>
        </UserProvider>
      </GoogleMaps>
    </PinsProvider>
  );
}
