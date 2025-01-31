import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry, readTrip } from '../lib/data';

export function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>(); // Extract tripId from the URL
  const [entry, setEntry] = useState<Entry | null>(null);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTripDetails() {
      if (!tripId) return; // Guard clause in case tripId is missing
      setIsLoading(true);
      try {
        const trip = await readTrip(Number(tripId)); // Fetch trip details by tripId
        if (trip) {
          setEntry(trip); // Only set state if trip is valid
        } else {
          setEntry(null); // If no trip is found, set entry to null
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

  // Since we are now using the first photo as the cover, we don't need separate cover photo logic.

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

      <div className="photos">
        <h3>Photos:</h3>
        {entry.photos?.map((photo, index) => {
          // Skip the first photo because it's already being shown as the cover
          if (index === 0) return null;
          return (
            <div key={index}>
              <img
                src={photo.photoUrl}
                alt={`Photo ${index + 1}`}
                style={{ width: '200px', height: 'auto', margin: '10px' }}
              />
            </div>
          );
        })}
      </div>

      {/* Displaying the first photo as the cover photo */}
      {/* <div>
        {entry.photos?.length > 0 && (
          <div>
            <h3>Cover Photo:</h3>
            <img
              src={entry.photos[0].photoUrl}
              alt="Cover Photo"
              style={{ width: '300px', height: 'auto' }}
            />
          </div>
        )}
      </div> */}
    </div>
  );
}
