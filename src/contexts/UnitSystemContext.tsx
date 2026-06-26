import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UnitSystem = 'Metric (SI)' | 'US Customary / Imperial';

interface UnitSystemContextProps {
  standard: UnitSystem;
  toggleStandard: () => void;
  setStandard: (std: UnitSystem) => void;
}

const UnitSystemContext = createContext<UnitSystemContextProps | undefined>(undefined);

export function UnitSystemProvider({ children }: { children: ReactNode }) {
  const [standard, setStandardState] = useState<UnitSystem>(() => {
    let initialStandard: UnitSystem = 'Metric (SI)';
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const lowercaseZone = zone.toLowerCase();
      if (lowercaseZone.includes('america') || lowercaseZone.includes('us/') || lowercaseZone.includes('canada')) {
        initialStandard = 'US Customary / Imperial';
      }
    } catch (e) {
      console.warn("Failed to auto-detect geo metrics.", e);
    }

    const savedStandard = typeof window !== 'undefined' ? localStorage.getItem('carecalculus-standard') : null;
    if (savedStandard === 'Metric (SI)' || savedStandard === 'US Customary / Imperial') {
      initialStandard = savedStandard as UnitSystem;
    }

    return initialStandard;
  });

  const setStandard = (std: UnitSystem) => {
    setStandardState(std);
    localStorage.setItem('carecalculus-standard', std);
  };

  const toggleStandard = () => {
    const nextStandard = standard === 'Metric (SI)' ? 'US Customary / Imperial' : 'Metric (SI)';
    setStandard(nextStandard);
  };

  useEffect(() => {
    localStorage.setItem('carecalculus-standard', standard);
  }, [standard]);

  return (
    <UnitSystemContext.Provider value={{ standard, toggleStandard, setStandard }}>
      {children}
    </UnitSystemContext.Provider>
  );
}

export function useUnitSystem() {
  const context = useContext(UnitSystemContext);
  if (context === undefined) {
    throw new Error('useUnitSystem must be used within a UnitSystemProvider');
  }
  return context;
}
