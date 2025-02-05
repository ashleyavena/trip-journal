// data

import { User } from '../components/UserContext';

export type Photo = {
  photoId: number;
  tripId: number;
  photoUrl: string;
  updatedAt: string;
};

export type Entry = {
  tripId?: number;
  userId?: number;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  photos: Photo[];
  coverPhoto?: string;
  location: string;
  lat: number;
  lng: number;
};

export type LocationProps = {
  lat: number;
  lng: number;
  name: string;
};

export type MapProps = {
  locations: LocationProps[];
};

export type PoiMarkersProps = {
  pois: LocationProps[];
};

export type OnAddLocationProps = {
  onAddLocation: (location: string, lat: number, lng: number) => void;
};

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
  console.log(user, token, "what's up");
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  console.log('token from storage', localStorage.getItem(authKey));
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function readTrips(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/trips', req);
  if (!res.ok) {
    console.error('Fetch error details:', {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(`Failed to fetch trips. Status: ${res.status}`);
  }

  const trips = await res.json();
  console.log('Fetched Trips:', trips); // Check the data
  return trips as Entry[];
}

export async function readTrip(tripId: number): Promise<Entry | undefined> {
  const response = await fetch(`/api/trips/${tripId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  console.log('Response from /api/trips:', response);
  if (!response.ok) {
    throw new Error(`Failed to fetch trip. Status: ${response.status}`);
  }
  const data = (await response.json()) as Entry;
  return data;
}

// This function will fetch all the locations of trips for the user
//
export async function readAllTripLocations(): Promise<
  { lat: number; lng: number; name: string }[]
> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const res = await fetch('/api/locations', req);
  if (!res.ok) {
    console.error('Fetch error details:', {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(`Failed to fetch trip locations. Status: ${res.status}`);
  }

  const locations = await res.json();
  console.log('Fetched trip locations:', locations);
  return locations; // Returns an array of locations { lat, lng, name }
}

// addTrip
export async function addTrip(newEntry: Entry) {
  const userId = readUser()?.userId;
  if (!userId) {
    throw new Error('User is not authenticated');
  }

  const { title, startDate, endDate, description, location } = newEntry;
  if (!title || !startDate || !endDate || !description || !location) {
    throw new Error(
      'Title, start, end date, desc, location are required fields.'
    );
  }
  if (
    isNaN(new Date(startDate).getTime()) ||
    isNaN(new Date(endDate).getTime())
  ) {
    throw new Error('Invalid date format');
  }

  const entryData = {
    ...newEntry,
    userId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    description,
    location,
  };

  console.log('Sending trip data:', entryData);

  const response = await fetch('/api/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(entryData),
  });
  if (!response.ok)
    throw new Error(
      `Failed to create trip. Response status ${response.status}`
    );
  const data = (await response.json()) as Entry;
  return data;
}

export async function updateEntry(entry: Entry) {
  const response = await fetch(`/api/trips/${entry.tripId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok)
    throw new Error(`Failed to update entry ${response.status}`);
  const data = (await response.json()) as Entry;
  return data;
}

export async function removeEntry(entryId: number) {
  const response = await fetch(`/api/trips/${entryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!response.ok)
    throw new Error(`Failed to delete entry ${response.status}`);
  return (await response.json()) as Entry;
}
