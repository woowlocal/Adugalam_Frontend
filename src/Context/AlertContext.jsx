import React, { createContext, useContext, useState, useCallback } from 'react';
import './Alert.css';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
  });

  const showAlert = useCallback((message) => {
    let msgStr = message;
    if (typeof message === 'object' && message !== null) {
      msgStr = message.message || JSON.stringify(message);
    }
    setAlertState({
      isOpen: true,
      message: String(msgStr || ''),
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  React.useEffect(() => {
    // Store original alert
    const originalAlert = window.alert;
    
    // Override window.alert
    window.alert = (message) => {
      showAlert(message);
    };

    return () => {
      // Restore original alert on unmount
      window.alert = originalAlert;
    };
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertState.isOpen && (
        <div className="custom-alert-overlay" onClick={closeAlert}>
          <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
            <div className="custom-alert-content">
              <p>{alertState.message}</p>
            </div>
            <button className="custom-alert-btn" onClick={closeAlert}>
              OK
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
