import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Entry, readTrip } from '../lib/data';
import { Carousel } from '../components/Carousel';
import { FaPencilAlt } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';

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
        console.log('Trip data received:', trip);
        if (trip) {
          console.log('2 received:', trip);
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
      <div className="column-half">
        <div className="row">
          <div className="column-full d-flex justify-between">
            <h3>{entry.title}</h3>
            <Link to={`/details/${entry.tripId}`}>
              <FaPencilAlt />
            </Link>
            <Link to={`/uploadImages/${entry.tripId}`}>
              <IoMdPhotos />
            </Link>
          </div>
        </div>
      </div>
      <p>
        <strong>Description:</strong>{' '}
        {entry?.description || 'Description not available'}
      </p>
      <p>
        <strong>Start Date:</strong> {entry.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {entry.endDate}
      </p>
      <p>
        <strong>Location:</strong> {entry?.location || 'Location not available'}
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
