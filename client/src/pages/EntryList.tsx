import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Entry, readTrips } from '../lib/data';
import '../styles.css';

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
    <div className="entry-list-container bg-cover bg-center bg-no-repeat sm:bg-[url('../public/mobileLogin.jpg')] md:bg-[url('../public/desktopHome.jpg')]">
      <div className="container mt-10">
        <div className="row">
          <div className="column-full d-flex justify-between align-center">
            <h1 className="text-2xl font-bold text-white">Entries</h1>
            <h3>
              <Link to="/trips/new" className="white-text form-link">
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
    </div>
  );
}
function EntryCard({ entry }: { entry: Entry }) {
  console.log('Image path:', entry.photos?.[0]?.photoUrl);

  return (
    <li className="entry-card">
      <div className="row">
        <div className="column-half">
          <Link to={`/trip/${entry.tripId}`} className="block">
            <img
              className="input-b-radius form-image"
              src={entry.photos?.[0]?.photoUrl || '/images/placeholder.svg'}
              alt="entry"
            />
          </Link>
          <h3 className="text-white">{entry.title}</h3>
        </div>
      </div>
    </li>
  );
}
