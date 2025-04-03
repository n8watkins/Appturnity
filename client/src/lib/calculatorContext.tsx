import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for calculator data
type CalculatorData = {
  screens: number;
  users: number;
  features: string[];
  oneTimeCost: number;
  monthlyCost: number;
};

// Define the context type
type CalculatorContextType = {
  calculatorData: CalculatorData | null;
  setCalculatorData: (data: CalculatorData | null) => void;
};

// Create context with default values
const CalculatorContext = createContext<CalculatorContextType>({
  calculatorData: null,
  setCalculatorData: () => {},
});

// Define props for provider component
type CalculatorProviderProps = {
  children: ReactNode;
};

// Create provider component
export function CalculatorProvider({ children }: CalculatorProviderProps) {
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);

  return (
    <CalculatorContext.Provider value={{ calculatorData, setCalculatorData }}>
      {children}
    </CalculatorContext.Provider>
  );
}

// Create custom hook to use the calculator context
export function useCalculator() {
  return useContext(CalculatorContext);
}