import { useLoadScript } from '@react-google-maps/api';

const googleAPIKey = 'AIzaSyAfLTysbv8DhH39VJsyKyeT-3mdLVsgwFY'; // for direct usage
const libraries: 'places'[] = ['places']; // Load the Places API for Autocomplete

export function GoogleMaps({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleAPIKey,
    libraries,
  });

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return <>{children}</>;
}

//  <GoogleMaps> component acts as a wrapper for the rest of the map-related features
//  ensures the Maps API is ready before rendering the children components like the map itself
