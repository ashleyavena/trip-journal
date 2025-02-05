import { useLoadScript } from '@react-google-maps/api';

const googleAPIKey = 'AIzaSyAfLTysbv8DhH39VJsyKyeT-3mdLVsgwFY'; // This is for direct usage, but it's better to use .env
const libraries: 'places'[] = ['places']; // Load the Places API for Autocomplete

export function GoogleMaps({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleAPIKey, // Or import.meta.env.VITE_GOOGLE_MAPS_API_KEY if using .env
    libraries,
  });

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return <>{children}</>; // Render children only when the API is ready
}
