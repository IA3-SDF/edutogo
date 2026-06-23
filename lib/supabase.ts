import { supabase } from "./supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Gets the pre-configured Supabase Client.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "Supabase URL or Anon Key is missing. Falling back to initial state.",
    );
    return null;
  }
  return supabase;
}

/**
 * Helper to check if Supabase is fully configured
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
