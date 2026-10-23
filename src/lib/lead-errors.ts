export function leadErrorMessage(error: { code?: string } | null): string {
  if (error?.code === "42501") {
    return "Your enquiry could not be saved because submissions are not permitted. Please contact us on WhatsApp. (42501)";
  }
  if (error?.code === "PGRST204" || error?.code === "PGRST205") {
    return `Your enquiry could not be saved because the enquiry service is not configured correctly. Please contact us on WhatsApp. (${error.code})`;
  }
  if (error?.code === "23502" || error?.code === "23505" || error?.code === "22P02") {
    return `Your enquiry could not be saved because the enquiry service rejected these details. Please contact us on WhatsApp. (${error.code})`;
  }
  return "Your enquiry was not confirmed. Please check your connection or contact us on WhatsApp before retrying.";
}