import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Medical history utility functions
export async function saveMedicalHistory(type: string, data: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("User not authenticated", userError);
    return;
  }

  const { error } = await supabase.from("medical_history").insert([
    {
      user_id: user.id,
      type,
      data,
    },
  ]);

  if (error) console.error("Error saving medical history:", error.message);
}

export async function fetchMedicalHistory() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return [];

  const { data, error } = await supabase
    .from("medical_history")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching medical history:", error.message);
    return [];
  }

  return data;
}
