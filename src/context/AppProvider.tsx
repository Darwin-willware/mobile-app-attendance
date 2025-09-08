import React from 'react';
import { StatusRefreshProvider } from './StatusRefreshContext';
import { ToastProvider } from './ToastContext';
import { UserProvider } from './userContext';

// import other providers as needed

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <ToastProvider>
        <StatusRefreshProvider>
        {children}
        </StatusRefreshProvider>
      </ToastProvider>
    </UserProvider>
  );
};
