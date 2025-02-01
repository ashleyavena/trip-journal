import { useLoadScript } from '@react-google-maps/api';

const libraries: 'places'[] = ['places']; // Load the Places API for Autocomplete

export function GoogleMaps({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Load from .env
    libraries,
  });

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return <>{children}</>; // Render children only when the API is ready
}
