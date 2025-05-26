// context/MedicalHistoryContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type HistoryItem = {
  id: string;
  type: "Appointment" | "Medicine" | "Analysis";
  data: string;
  date: string;
};

type MedicalHistoryContextType = {
  history: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, "id" | "date">) => void;
};

const MedicalHistoryContext = createContext<MedicalHistoryContextType | undefined>(undefined);

export const useMedicalHistory = () => {
  const context = useContext(MedicalHistoryContext);
  if (!context) throw new Error("MedicalHistoryProvider is missing");
  return context;
};

export const MedicalHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("medical-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("medical-history", JSON.stringify(history));
  }, [history]);

  const addHistory = (item: Omit<HistoryItem, "id" | "date">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleString(),
    };
    setHistory((prev) => [...prev, newItem]);
  };

  return (
    <MedicalHistoryContext.Provider value={{ history, addHistory }}>
      {children}
    </MedicalHistoryContext.Provider>
  );
};
