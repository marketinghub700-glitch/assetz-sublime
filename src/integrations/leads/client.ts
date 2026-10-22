import { createClient } from "@supabase/supabase-js";

// External lead-collection project (publishable key is safe in browser code).
const LEADS_URL = "https://pbzqdfffuqyxopifngdy.supabase.co";
const LEADS_KEY = "sb_publishable_PyVm9GW_OgVFveiwU-TK7A_wYa8V-LG";

export const LEADS_TABLE = "assetz_sublime";
export const LEAD_PROJECT = "Assetz Sublime";
export const LEAD_SOURCE = "Google Ads";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: ReturnType<typeof createClient<any>> | undefined;

export function leadsClient() {
  if (!client) {
    client = createClient<any>(LEADS_URL, LEADS_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, storageKey: "leads-auth" },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (headers.get("Authorization") === `Bearer ${LEADS_KEY}`) headers.delete("Authorization");
          headers.set("apikey", LEADS_KEY);
          return fetch(input, { ...init, headers });
        },
      },
    });
  }
  return client;
}
