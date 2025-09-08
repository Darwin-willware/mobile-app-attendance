// context/StatusRefreshContext.tsx
import React, { createContext, useContext, useState } from 'react';

const StatusRefreshContext = createContext<{
  triggerRefresh: () => void;
  refreshKey: number;
}>({
  triggerRefresh: () => {},
  refreshKey: 0,
});

export const StatusRefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <StatusRefreshContext.Provider value={{ triggerRefresh, refreshKey }}>
      {children}
    </StatusRefreshContext.Provider>
  );
};

export const useStatusRefresh = () => useContext(StatusRefreshContext);
