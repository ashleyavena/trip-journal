import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type Entry,
  addTrip,
  readTrip,
  readUser,
  removeEntry,
  updateEntry,
} from '../lib/data';

/**
 * Form that adds or edits an entry.
 * Gets `entryId` from route.
 * If `entryId` === 'new' then creates a new entry.
 * Otherwise reads the entry and edits it.
 */
export function TripEntryForm() {
  const { tripId } = useParams();
  const [entry, setEntry] = useState<Entry>();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const isEditing = tripId && tripId !== 'new';

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const entry = await readTrip(id);
        if (!entry) throw new Error(`Entry with ID ${id} not found`);
        setEntry(entry);
        // setPhotoUrl(entry.photoUrl);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+tripId);
  }, [tripId, isEditing]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const newEntry = Object.fromEntries(formData) as unknown as Entry;
      const userId = readUser()?.userId;
      if (!userId) {
        alert('User is not authenticated. Please log in again.');
        navigate('/login'); // Redirect to login page
        return;
      }

      if (isEditing) {
        updateEntry({ ...entry, ...newEntry });
      } else {
        addTrip(newEntry);
      }
      alert('a new post was made!');
      navigate('/');
    } catch (error) {
      alert('there was an error updating entry' + error);
    }
  }

  function handleDelete() {
    try {
      if (!entry?.tripId) throw new Error('Should never happen');
      removeEntry(entry.tripId);
      navigate('/');
    } catch (error) {
      alert('there was an error deleting entry' + error);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entry with ID {tripId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="column-full d-flex justify-between">
          <h1>{isEditing ? 'Edit Entry' : 'New Entry'}</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row margin-bottom-1">
          <div className="column-half">
            <img
              className="input-b-radius form-image"
              src={photoUrl || '/images/placeholder-image-square.jpg'}
              alt="entry"
            />
          </div>
          <div className="column-half">
            <label className="margin-bottom-1 d-block">
              Title
              <input
                name="title"
                defaultValue={entry?.title ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              Photo URL
              <input
                name="photoUrl"
                // defaultValue={entry?.photoUrl ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="row margin-bottom-1">
          <div className="column-full">
            <label className="margin-bottom-1 d-block">
              Notes
              <textarea
                name="notes"
                defaultValue={entry?.description ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline d-block width-100"
                cols={30}
                rows={10}
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="column-full d-flex justify-between">
            {isEditing && (
              <button
                className="delete-entry-button"
                type="button"
                onClick={() => setIsDeleting(true)}>
                Delete Entry
              </button>
            )}
            <button className="input-b-radius text-padding purple-background white-text">
              SAVE
            </button>
          </div>
        </div>
      </form>
      {isDeleting && (
        <div
          id="modalContainer"
          className="modal-container d-flex justify-center align-center">
          <div className="modal row">
            <div className="column-full d-flex justify-center">
              <p>Are you sure you want to delete this entry?</p>
            </div>
            <div className="column-full d-flex justify-between">
              <button
                className="modal-button"
                onClick={() => setIsDeleting(false)}>
                Cancel
              </button>
              <button
                className="modal-button red-background white-text"
                onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
