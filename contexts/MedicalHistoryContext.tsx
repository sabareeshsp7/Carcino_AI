// context/MedicalHistoryContext.tsx
// Revert to original localStorage-only implementation
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface HistoryItem {
  id: string;
  type: "Appointment" | "Medicine" | "Analysis";
  data: string;
  details?: any;
  date: string;
}

type MedicalHistoryContextType = {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, "id" | "date">) => void;
  refreshHistory: () => void;
  isLoading: boolean;
};

const MedicalHistoryContext = createContext<MedicalHistoryContextType | undefined>(undefined);

export const useMedicalHistory = () => {
  const context = useContext(MedicalHistoryContext);
  if (!context) throw new Error("MedicalHistoryProvider is missing");
  return context;
};

export const MedicalHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      setIsLoading(true);
      try {
        const saved = localStorage.getItem("medical-history");
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const addHistory = (item: Omit<HistoryItem, "id" | "date">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };

    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("medical-history", JSON.stringify(updatedHistory));
  };

  const refreshHistory = () => {
    const saved = localStorage.getItem("medical-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Error refreshing history:", error);
      }
    }
  };

  return (
    <MedicalHistoryContext.Provider value={{ history, addHistory, refreshHistory, isLoading }}>
      {children}
    </MedicalHistoryContext.Provider>
  );
};
