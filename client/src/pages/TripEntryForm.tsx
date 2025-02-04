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
import { Autocomplete } from '@react-google-maps/api';

/**
 * Form that adds or edits an entry.
 * Gets `entryId` from route.
 * If `entryId` === 'new' then creates a new entry.
 * Otherwise reads the entry and edits it.
 */
export function TripEntryForm({
  onAddLocation,
}: {
  onAddLocation: (location: string, lat: number, lng: number) => void;
}) {
  const { tripId } = useParams();
  const [entry, setEntry] = useState<Entry>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const navigate = useNavigate();
  const isEditing = tripId && tripId !== 'new';

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const entry = await readTrip(id);
        if (!entry) throw new Error(`Entry with ID ${id} not found`);
        setEntry(entry);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+tripId);
  }, [tripId, isEditing]);

  const handlePlaceChanged = (
    autocomplete: google.maps.places.Autocomplete | null
  ) => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place || !place.geometry || !place.geometry.location) {
      console.error('No geometry available for selected place:', place);
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setLocation(place.formatted_address || '');
    setCoordinates({ lat, lng });

    // Call the function to add the new pin
    onAddLocation(place.formatted_address || '', lat, lng);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      const userId = readUser()?.userId;
      if (!userId) {
        alert('User is not authenticated. Please log in again.');
        navigate('/login');
        return;
      }
      const newEntry = Object.fromEntries(formData) as unknown as Entry;

      newEntry.location = location; // Use the selected location name
      newEntry.lat = coordinates?.lat ?? 0; // Default to 0 if undefined
      newEntry.lng = coordinates?.lng ?? 0;

      if (isEditing) {
        updateEntry({ ...entry, ...newEntry });
      } else {
        addTrip(newEntry);
      }
      alert('a new post was made!');
      navigate('/trips');
    } catch (error) {
      alert('there was an error updating entry' + error);
    }
  }

  function handleDelete() {
    try {
      if (!entry?.tripId) throw new Error('Should never happen');
      removeEntry(entry.tripId);
      navigate('/trips');
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
              Start Date
              <input
                name="startDate"
                type="date"
                defaultValue={entry?.startDate ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              End Date
              <input
                name="endDate"
                type="date"
                defaultValue={entry?.endDate ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
            </label>
            <label>Location</label>
            <Autocomplete onLoad={(e) => handlePlaceChanged(e)}>
              <input
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Enter a location"
              />
            </Autocomplete>
          </div>
        </div>

        <div className="row margin-bottom-1">
          <div className="column-full">
            <label className="margin-bottom-1 d-block">
              Description
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
