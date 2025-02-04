import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Pin,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import '../App.css';
import { GoogleMaps } from '../components/GoogleMaps';

interface PinData {
  lat: number;
  lng: number;
  name: string;
}

export function MapPage({ pins }: { pins: PinData[] }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const mapID = '67ffa5c4542cb48d'; // Map ID for styling (optional)

  const PoiMarkers = ({ pois }: { pois: PinData[] }) => (
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
            <PoiMarkers pois={pins} />
          </Map>
        </APIProvider>
      </GoogleMaps>
    </div>
  );
}
