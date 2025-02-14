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
    <div className="entry-list-container min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat bg-fixed bg-[url('../public/mobileCancun.jpg')] md:bg-[url('../public/desktopHome.jpg')]">
      <div className="container ">
        <div className="flex flex-col  items-center text-center mb-20">
          <h1 className="caveat-400 text-white mb-10 mt-[20px]">
            Relive and Wander Through Your Journeys
          </h1>
          <h3>
            <Link
              to="/details/new"
              className="ysabeau-sc-200 text-xl white-text form-link hidden md:inline-block">
              record a new trip
            </Link>
          </h3>
        </div>

        <div className="flex flex-col items-center">
          <ul className="entry-ul flex flex-wrap gap-4 justify-center items-center">
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
    <li className="entry-card flex flex-col items-center ">
      <div className="column-full w-full max-w-4xl">
        <Link to={`/trip/${entry.tripId}`} className="block">
          <img
            className="input-b-radius form-image w-full h-auto"
            src={entry.photos?.[0]?.photoUrl || '/images/placeholder.svg'}
            alt="entry"
          />
        </Link>
        <h3 className="merriweather-regular text-white text-center mt-2">
          {entry.title}
        </h3>
      </div>
    </li>
  );
}
