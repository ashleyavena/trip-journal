import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import { Entry, readTrips } from '../lib/data';

export function TripList() {
  const [trips, setTrips] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      try {
        const trips = await readTrips();
        setTrips(trips);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Trips:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="column-full d-flex justify-between align-center">
          <h1>Trips</h1>
          <h3>
            <Link to="/details/new" className="white-text form-link">
              NEW
            </Link>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          <ul className="trip-ul">
            {trips.map((trip) => (
              <TripCard key={trip.tripId} trip={trip} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type TripProps = {
  trip: Entry;
};

function TripCard({ trip }: TripProps) {
  return (
    <li>
      <div className="row">
        <div className="column-half">
          {trip.photoUrl ? (
            <img
              className="input-b-radius form-image"
              src={trip.photoUrl}
              alt={trip.title || 'Trip Photo'}
            />
          ) : (
            <div className="no-photo-placeholder">No Photo</div>
          )}
        </div>
        <div className="column-half">
          <div className="row">
            <div className="column-full d-flex justify-between">
              <h3>{trip.title}</h3>
              <Link to={`details/${trip.tripId}`}>
                <FaPencilAlt />
              </Link>
            </div>
          </div>
          <p>{trip.description || 'No description available.'}</p>
        </div>
      </div>
    </li>
  );
}
