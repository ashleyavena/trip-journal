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
import { usePins } from '../components/PinsContext';

export function TripEntryForm() {
  const { addPin } = usePins();
  const { tripId } = useParams();
  const [entry, setEntry] = useState<Entry>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const navigate = useNavigate();
  const isEditing = tripId && tripId !== 'new';
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

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

  //  to save location in form
  useEffect(() => {
    async function load() {
      if (tripId && isEditing) {
        const entryData = await readTrip(+tripId);
        setEntry(entryData);
        setLocation(entryData?.location || '');
        setCoordinates({
          lat: entryData?.lat || 0,
          lng: entryData?.lng || 0,
        });
      }
    }
    load();
  }, [tripId, isEditing]);

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    console.log('Selected place:', place);

    if (!place || !place.geometry || !place.geometry.location) {
      console.error('No geometry available for selected place:', place);
      alert('Unable to retrieve location data for the selected place.');
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setLocation(place.formatted_address || ''); // setting the state with the data from Place
    setCoordinates({ lat, lng });

    addPin(place.formatted_address || '', lat, lng);
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
      newEntry.description = description;
      newEntry.location = location; // Use the selected location name
      newEntry.lat = coordinates?.lat ?? 0;
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
    <div className="min-h-screen flex items-center justify-center  bg-cover bg-center bg-no-repeat bg-[url('../public/collage.jpg')] md:bg-[url('../public/collage.jpg')]">
      <div className="container bg-white/50 w-full max-w-2xl p-4  bg-opacity-75 rounded-md shadow-lg">
        <div className="row mb-4">
          <div className="column-full text-center delius-unicase-regular ">
            <h1>{isEditing ? 'Edit Entry' : 'New Entry'}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="d-block font-bold">
              Title
              <input
                name="title"
                defaultValue={entry?.title ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height d-block w-full"
                type="text"
              />
            </label>

            <label className="d-block font-bold">
              Start Date
              <input
                name="startDate"
                type="date"
                defaultValue={entry?.startDate ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height d-block w-full"
              />
            </label>

            <label className="d-block font-bold">
              End Date
              <input
                name="endDate"
                type="date"
                defaultValue={entry?.endDate ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height d-block w-full"
              />
            </label>

            <div>
              <label className="d-block font-bold">
                Location
                <Autocomplete
                  onPlaceChanged={handlePlaceChanged}
                  onLoad={handleLoad}>
                  <input
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="Enter a location"
                    className="input-b-color text-padding input-b-radius purple-outline w-full"
                  />
                </Autocomplete>
              </label>
            </div>
          </div>

          <div>
            <label className="d-block font-bold">
              Description
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input-b-color text-padding input-b-radius purple-outline w-full"
                cols={30}
                rows={10}
              />
            </label>
          </div>

          <div className="flex justify-between">
            {isEditing && (
              <button
                className="delete-entry-button"
                type="button"
                onClick={() => setIsDeleting(true)}>
                Delete Entry
              </button>
            )}
            <button className="text-padding text-white ">SAVE</button>
          </div>
        </form>

        {isDeleting && (
          <div
            id="modalContainer"
            className="modal-container flex justify-center items-center">
            <div className="modal p-4 w-96 bg-white rounded-md shadow-lg">
              <div className="column-full text-center mb-4">
                <p>Are you sure you want to delete this entry?</p>
              </div>
              <div className="column-full flex justify-between">
                <button
                  className="modal-button-cancel"
                  onClick={() => setIsDeleting(false)}>
                  Cancel
                </button>
                <button className="modal-button-confirm" onClick={handleDelete}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
