import {
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
  APIProvider,
} from '@vis.gl/react-google-maps';
import { GoogleMaps } from '../components/GoogleMaps';
import '../App.css';
import { useEffect, useState } from 'react';

export function MapPage() {
  const [isLoaded, setIsLoaded] = useState(false); // State to track if map API is loaded

  useEffect(() => {
    // Assuming `GoogleMaps` component handles API load status internally.
    // You can adjust based on the logic you use.
    setIsLoaded(true); // Set to true when Google Maps API is successfully loaded
  }, []);

  const mapID = '67ffa5c4542cb48d'; // Map ID for styling (optional)

  type Poi = {
    key: string;
    location: google.maps.LatLngLiteral;
  };

  const locations: Poi[] = [
    { key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108 } },
    { key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 } },
  ];

  const PoiMarkers = ({ pois }: { pois: Poi[] }) => (
    <>
      {pois.map((poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={'#FBBC04'}
            glyphColor={'#000'}
            borderColor={'#000'}
          />
        </AdvancedMarker>
      ))}
    </>
  );
  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }
  return (
    <div id="map-container">
      <h3>GOOGLE MAP PAGE</h3>
      <GoogleMaps>
        <APIProvider
          apiKey="AIzaSyAfLTysbv8DhH39VJsyKyeT-3mdLVsgwFY"
          onLoad={() => console.log('Maps API has loaded.')}>
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }} // Sydney
            mapId={mapID} // Use the mapID for styling
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                'camera changed:',
                ev.detail.center,
                'zoom:',
                ev.detail.zoom
              )
            }>
            {/* Render markers using PoiMarkers */}
            <PoiMarkers pois={locations} />
          </Map>
        </APIProvider>
      </GoogleMaps>
    </div>
  );
}
