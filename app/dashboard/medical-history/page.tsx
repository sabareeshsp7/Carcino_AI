"use client";

import { useMedicalHistory } from "@/contexts/MedicalHistoryContext";

export default function MedicalHistoryPage() {
  const { history } = useMedicalHistory();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Medical History</h1>
      {history.length === 0 ? (
        <p className="text-gray-500">No history yet. Save actions from the app to view here.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <li key={item.id} className="border rounded p-4 shadow">
              <p className="font-semibold">{item.type}</p>
              <p>{item.data}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
