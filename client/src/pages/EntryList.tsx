import { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Entry, readTrips } from '../lib/data';
import { IoMdPhotos } from 'react-icons/io';

export function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        setEntries(await readTrips());
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error Loading Entries:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  return (
    <div className="container">
      <div className="row">
        <div className="column-full d-flex justify-between align-center">
          <h1>Entries</h1>
          <h3>
            <Link to="/details/new" className="white-text form-link">
              NEW
            </Link>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          <ul className="entry-ul">
            {entries.map((entry) => (
              <EntryCard key={entry.tripId} entry={entry} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <li>
      <div className="row">
        <div className="column-half">
          <Link to={`/trip/${entry.tripId}`}>
            <img
              className="input-b-radius form-image"
              style={{ width: 200, height: 200, objectFit: 'contain' }}
              src={
                entry.photos?.[0]?.photoUrl ||
                '/images/placeholder-image-square.jpg'
              }
              alt="entry"
            />
          </Link>
        </div>
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
          <p>{entry.description}</p>
        </div>
      </div>
    </li>
  );
}
