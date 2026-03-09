import { createContext, useContext, type ReactNode } from "react";
import type { InitialDataEnvelope } from "./types";

const InitialDataContext = createContext<InitialDataEnvelope | null>(null);

interface InitialDataProviderProps {
  initialData: InitialDataEnvelope | null;
  children: ReactNode;
}

export function InitialDataProvider({ initialData, children }: InitialDataProviderProps) {
  return <InitialDataContext.Provider value={initialData}>{children}</InitialDataContext.Provider>;
}

export function useInitialData() {
  return useContext(InitialDataContext);
}
