import { createClient } from "@supabase/supabase-js";

// External lead-collection project (publishable key is safe in browser code).
const LEADS_URL = "https://pbzqdfffuqyxopifngdy.supabase.co";
const LEADS_KEY = "sb_publishable_PyVm9GW_OgVFveiwU-TK7A_wYa8V-LG";

export const LEADS_TABLE = "assetz_sublime";
export const LEAD_PROJECT = "Assetz Sublime";
export const LEAD_SOURCE = "Google Ads";

// NeoDove CRM webhook — each enquiry is also delivered here.
export const CRM_WEBHOOK_URL =
  "https://a0df22bd-df55-4d2a-8f0a-7df0bb607a27.neodove.com/integration/custom/991e0960-a03f-45de-a0e3-e1fe918222b6/leads";

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
