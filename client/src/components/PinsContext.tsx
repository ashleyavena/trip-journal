import React, { createContext, useState, useContext } from 'react';

// Create the context for pins
const PinsContext = createContext<{
  pins: { lat: number; lng: number; name: string }[];
  addPin: (location: string, lat: number, lng: number) => void;
} | null>(null);

// Custom hook to use PinsContext
export const usePins = () => {
  const context = useContext(PinsContext);
  if (!context) {
    throw new Error('usePins must be used within a PinsProvider');
  }
  return context;
};

// Provider component to wrap the app and share pins state
export const PinsProvider = ({ children }: { children: React.ReactNode }) => {
  const [pins, setPins] = useState<
    { lat: number; lng: number; name: string }[]
  >([]);

  const addPin = (location: string, lat: number, lng: number) => {
    setPins((prevPins) => [...prevPins, { lat, lng, name: location }]);
  };

  return (
    <PinsContext.Provider value={{ pins, addPin }}>
      {children}
    </PinsContext.Provider>
  );
};
