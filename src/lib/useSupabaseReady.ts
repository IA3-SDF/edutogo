"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";

// Basic hook to detect if Supabase client is available and a session exists.
export function useSupabaseReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          if (mounted) setIsReady(false);
          return;
        }
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) setIsReady(!!session || true);
      } catch (err) {
        if (mounted) setIsReady(false);
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return { isReady };
}
