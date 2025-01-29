// data

import { User } from '../components/UserContext';

export type Entry = {
  tripId?: number;
  userId?: number;
  title: string;
  description: string;
  photoUrl: string;
  startDate: number;
  endDate: number;
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
  if (!response.ok) {
    throw new Error(`Failed to fetch trip. Status: ${response.status}`);
  }
  const data = (await response.json()) as Entry;
  return data;
}

export async function addTrip(newEntry: Entry) {
  const userId = readUser()?.userId; // Get the userId dynamically from context
  if (!userId) {
    throw new Error('User is not authenticated');
  }

  const entryData = {
    ...newEntry,
    userId, // Ensure userId is included when creating a trip
  };

  console.log('userId', userId);
  console.log('Sending trip data:', entryData); // Log the request payload

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
