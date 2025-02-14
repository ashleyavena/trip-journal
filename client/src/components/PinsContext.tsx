import React, { createContext, useState, useContext } from 'react';

const PinsContext = createContext<{
  pins: { lat: number; lng: number; name: string }[];
  addPin: (location: string, lat: number, lng: number) => void;
}>({ pins: [], addPin: () => undefined });

// hook to use PinsContext
// eslint-disable-next-line react-refresh/only-export-components
export const usePins = () => {
  const context = useContext(PinsContext);
  if (!context) {
    throw new Error('usePins must be used within a PinsProvider');
  }
  return context;
};

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
