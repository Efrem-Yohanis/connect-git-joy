import React, { createContext, useContext, useState } from 'react';

interface SectionStatusCounts {
  total: number;
  deployed: number;
  drafted: number;
}

interface SectionContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  statusCounts: SectionStatusCounts;
  setStatusCounts: (counts: SectionStatusCounts) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState('Flows');
  const [statusCounts, setStatusCounts] = useState<SectionStatusCounts>({
    total: 9,
    deployed: 3,
    drafted: 5
  });

  return (
    <SectionContext.Provider value={{
      currentSection,
      setCurrentSection,
      statusCounts,
      setStatusCounts
    }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}