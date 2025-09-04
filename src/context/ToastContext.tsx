// src/context/ToastContext.tsx
import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/shared/Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

// ✅ Global toast function
let globalToast: (message: string, type?: ToastType) => void = () => {};

export const showGlobalToast = (message: string, type: ToastType = 'info') => {
  globalToast(message, type);
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  globalToast = showToast; // ✅ Assign to global function

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onHide={hideToast} />}
    </ToastContext.Provider>
  );
};