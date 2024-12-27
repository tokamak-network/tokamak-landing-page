"use client";

import { createContext, useContext, useState } from "react";

type FocusContextType = {
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
};

const FocusContext = createContext<FocusContextType>({
  isFocused: false,
  setIsFocused: () => {},
});

export const FocusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FocusContext.Provider value={{ isFocused, setIsFocused }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => useContext(FocusContext);
