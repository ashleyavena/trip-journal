import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Entry, readTrip } from '../lib/data';
import { Carousel } from '../components/Carousel';
import { FaPencilAlt } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import '../styles.css';
import { FaMapPin } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
  const handlePinClick = () => {
    if (entry?.lat && entry?.lng) {
      navigate('/map', {
        state: {
          location: entry?.location,
          lat: entry?.lat,
          lng: entry?.lng,
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-fixed bg-cover bg-center bg-no-repeat bg-[url('../public/desktopHome.jpg')] p-6">
      <div className="w-full max-w-3xl bg-white/80 p-6 rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">{entry.title}</h1>

        <div className="flex justify-center gap-4 mb-4">
          <Link
            to={`/details/${entry.tripId}`}
            className="text-xl text-blue-500">
            <FaPencilAlt />
          </Link>
          <Link
            to={`/uploadImages/${entry.tripId}`}
            className="text-xl text-blue-500">
            <IoMdPhotos />
          </Link>
        </div>

        {/* Render the Carousel Component */}
        {entry.photos && entry.photos.length > 0 && (
          <Carousel photos={entry.photos.map((photo) => photo.photoUrl)} />
        )}

        {/* Fallback if there are no photos */}
        {!entry.photos ||
          (entry.photos.length === 0 && <p>No photos available</p>)}

        <p className="flex items-center space-x-2">
          <button onClick={handlePinClick} className="text-xl text-blue-500">
            <FaMapPin />
          </button>
          <strong>Location:</strong>
          <span>{entry?.location || 'Location not available'}</span>
        </p>

        <p>
          <strong>Start Date:</strong>{' '}
          {new Date(entry.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p>
          <strong>End Date:</strong>{' '}
          {new Date(entry.endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p>
          <strong>Description:</strong>{' '}
          {entry?.description || 'Description not available'}
        </p>
      </div>
    </div>
  );
}
