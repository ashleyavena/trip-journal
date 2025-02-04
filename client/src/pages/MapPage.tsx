import { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Pin,
} from '@vis.gl/react-google-maps';
import { usePins } from '../components/PinsContext';

// type MapProps = {
//   locations: { lat: number; lng: number; name: string }[];
// };

export function MapPage() {
  const { pins } = usePins();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const mapID = '67ffa5c4542cb48d'; // Map ID for styling
  const apiKey = 'AIzaSyAfLTysbv8DhH39VJsyKyeT-3mdLVsgwFY';

  // PoiMarkers component for displaying markers
  const PoiMarkers = ({
    pois,
  }: {
    pois: { lat: number; lng: number; name: string }[];
  }) => (
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
    <div id="map-container">
      <h3>Map Page</h3>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultZoom={13}
          defaultCenter={
            pins.length ? pins[0] : { lat: 34.052235, lng: -118.243683 }
          } // Default to Los Angeles
          mapId={mapID}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log('Camera changed:', ev.detail.center)
          }>
          <PoiMarkers pois={pins} />
        </Map>
      </APIProvider>
    </div>
  ) : (
    <div>Loading Map...</div>
  );
}
