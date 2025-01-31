import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry, readTrip } from '../lib/data';
import { Carousel } from '../components/Carousel';

export function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTripDetails() {
      if (!tripId) return;
      setIsLoading(true);
      try {
        const trip = await readTrip(Number(tripId));
        if (trip) {
          setEntry(trip);
        } else {
          setEntry(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTripDetails();
  }, [tripId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error loading trip details:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!entry) return <div>No trip found</div>;
  return (
    <div className="container">
      <h1>{entry.title}</h1>
      <p>
        <strong>Description:</strong> {entry.description}
      </p>
      <p>
        <strong>Start Date:</strong> {entry.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {entry.endDate}
      </p>

      {/* Render the Carousel Component */}
      {entry.photos && entry.photos.length > 0 && (
        <Carousel photos={entry.photos.map((photo) => photo.photoUrl)} />
      )}

      {/* Fallback if there are no photos */}
      {!entry.photos ||
        (entry.photos.length === 0 && <p>No photos available</p>)}
    </div>
  );
}
//   return (
//     <div className="container">
//       <h1>{entry.title}</h1>
//       <p>
//         <strong>Description:</strong> {entry.description}
//       </p>
//       <p>
//         <strong>Start Date:</strong> {entry.startDate}
//       </p>
//       <p>
//         <strong>End Date:</strong> {entry.endDate}
//       </p>

//       <div className="photos">
//         <h3>Photos:</h3>
//         {entry.photos?.map((photo, index) => {
//           // console.log('TripDetailsPage - Photos:', entry.photos);

//           return (
//             <div key={index}>
//               <img
//                 src={photo.photoUrl}
//                 alt={`Photo ${index + 1}`}
//                 style={{ width: '200px', height: 'auto', margin: '10px' }}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
