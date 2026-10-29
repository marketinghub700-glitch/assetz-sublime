// Google Ads tag (AW-18063086765) with regional consent gating.
// No-banner route: the tag loads only for visitors outside regions that
// require tracking consent (EEA, UK, Switzerland). Region is read from the
// same-origin /cdn-cgi/trace endpoint; on failure or an unknown region the
// tag stays blocked.

const TAG_ID = "AW-18063086765";
const CONVERSION_SEND_TO = "AW-18063086765/1LnWCPvPspUcEK2pk6VD";

const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH",
]);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let regionCheck: Promise<boolean> | null = null;

function trackingAllowed(): Promise<boolean> {
  if (!regionCheck) {
    regionCheck = (async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const res = await fetch("/cdn-cgi/trace", { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) return false;
        const text = await res.text();
        const loc = text.match(/^loc=(.*)$/m)?.[1]?.trim() ?? "";
        if (!loc || loc === "XX" || loc === "T1") return false;
        return !CONSENT_REGIONS.has(loc);
      } catch {
        return false;
      }
    })();
  }
  return regionCheck;
}

let tagLoaded = false;

export async function initGtag(): Promise<boolean> {
  if (tagLoaded) return true;
  if (!(await trackingAllowed())) return false;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag.js needs the Arguments object
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", TAG_ID);
  tagLoaded = true;
  return true;
}

export async function trackLeadConversion(): Promise<void> {
  if (!(await initGtag())) return;
  window.gtag("event", "conversion", {
    send_to: CONVERSION_SEND_TO,
    value: 1.0,
    currency: "INR",
  });
}
