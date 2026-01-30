import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ExperienceMode = 'lawyer' | 'public';

interface ExperienceModeContextType {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
}

const ExperienceModeContext = createContext<ExperienceModeContextType | undefined>(undefined);

export const ExperienceModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ExperienceMode>(() => {
    // Get initial mode from localStorage or default to 'lawyer' for all users
    const savedMode = localStorage.getItem('experienceMode');
    // Default to 'lawyer' mode for all users (logged in or not)
    return (savedMode as ExperienceMode) || 'lawyer';
  });

  const updateMode = (newMode: ExperienceMode) => {
    setMode(newMode);
    localStorage.setItem('experienceMode', newMode);
  };

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('experienceMode', mode);
  }, [mode]);

  return (
    <ExperienceModeContext.Provider value={{ mode, setMode: updateMode }}>
      {children}
    </ExperienceModeContext.Provider>
  );
};

export const useExperienceMode = () => {
  const context = useContext(ExperienceModeContext);
  if (context === undefined) {
    throw new Error('useExperienceMode must be used within an ExperienceModeProvider');
  }
  return context;
};