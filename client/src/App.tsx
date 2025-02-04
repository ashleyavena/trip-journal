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
import { Home } from './pages/Home';
import { MapPage } from './pages/MapPage'; // MapPage handles map rendering
import { TripDetailsPage } from './pages/TripDetailsPage';
import { TripEntryForm } from './pages/TripEntryForm';

export default function App() {
  return (
    <PinsProvider>
      <GoogleMaps>
        <UserProvider>
          <Routes>
            <Route path="/" element={<GetStarted />}>
              <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
              <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            </Route>
            <Route path="/home" element={<Home />} />

            <Route path="/map" element={<MapPage />} />

            <Route path="/entry-form" element={<TripEntryForm />} />
            <Route path="/navBar" element={<NavBar />} />
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

// export default function App() {
// const [pins, setPins] = useState<
//   { lat: number; lng: number; name: string }[]
// >([]);

// // update the pins state
// const addNewPin = (location: string, lat: number, lng: number) => {
//   setPins((prevPins) => [...prevPins, { lat, lng, name: location }]);
// };
//   const mapID = '67ffa5c4542cb48d';

//   type Poi = {
//     key: string;
//     location: google.maps.LatLngLiteral;
//   };

//   const locations: Poi[] = [
//     { key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108 } },
//     { key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 } },
//     // Add more locations
//   ];

//   // PoiMarkers component for displaying markers
//   const PoiMarkers = ({ pois }: { pois: Poi[] }) => (
//     <>
//       {pois.map((poi) => (
//         <AdvancedMarker key={poi.key} position={poi.location}>
//           <Pin
//             background={'#FBBC04'}
//             glyphColor={'#000'}
//             borderColor={'#000'}
//           />
//         </AdvancedMarker>
//       ))}
//     </>
//   );

//   return (
//     <GoogleMaps>
//       <UserProvider>
// <APIProvider
//   apiKey="AIzaSyAfLTysbv8DhH39VJsyKyeT-3mdLVsgwFY"
//   onLoad={() => console.log('Maps API has loaded.')}>
//   <Map
//     defaultZoom={13}
//     defaultCenter={{ lat: -33.860664, lng: 151.208138 }} // Sydney
//     mapId={mapID} // Use the mapID for styling
//     onCameraChanged={(ev: MapCameraChangedEvent) =>
//       console.log(
//         'camera changed:',
//         ev.detail.center,
//         'zoom:',
//         ev.detail.zoom
//       )
//     }>
//     {/* Render markers using PoiMarkers */}
//     <PoiMarkers pois={locations} />
//   </Map>
// </APIProvider>
