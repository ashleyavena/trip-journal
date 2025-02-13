import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Pin,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { usePins } from '../components/PinsContext';
import { readAllTripLocations } from '../lib/data';
import { useLocation } from 'react-router-dom';

export function MapPage() {
  const { pins } = usePins();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tripLocations, setTripLocations] = useState<
    { lat: number; lng: number; name: string }[]
  >([]);
  const location = useLocation();
  const { lat, lng } = location.state?.pinLocation || {}; // get lat and lng from the state

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await readAllTripLocations();
        setTripLocations(locations);
      } catch (error) {
        console.error('Error fetching trip locations:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchLocations();
  }, []);

  const mapID = '67ffa5c4542cb48d'; // Map ID for styling
  const apiKey = 'AIzaSyAfLTysbv8DhH39VJsyKyeT-3mdLVsgwFY';

  type Poi = {
    lat: number;
    lng: number;
    name: string;
  };

  const allPins = [...tripLocations, ...pins];
  console.log('all pins:', allPins);

  // PoiMarkers, "point of interest", Google Maps API component for displaying markers
  const PoiMarkers = ({ pois }: { pois: Poi[] }) => (
    <>
      {pois.map((poi, index) => (
        <AdvancedMarker key={index} position={{ lat: poi.lat, lng: poi.lng }}>
          <Pin
            background={'#FBBC04'}
            glyphColor={'#000'}
            borderColor={'#000'}
          />
        </AdvancedMarker>
      ))}
    </>
  );

  return isLoaded ? (
    <GoogleMap>
      <div id="map-container">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultZoom={lat ? 13 : 5}
            center={lat ? { lat, lng } : undefined}
            defaultCenter={
              pins.length ? pins[0] : { lat: 34.8567844, lng: -118.213108 }
            } // Default to Los Angeles
            mapId={mapID}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log('Camera changed:', ev.detail.center)
            }>
            <PoiMarkers pois={allPins} />
          </Map>
        </APIProvider>
      </div>
    </GoogleMap>
  ) : (
    <div>Loading Map...</div>
  );
}
