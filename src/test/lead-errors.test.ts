import { describe, expect, it } from "vitest";
import { leadErrorMessage } from "@/lib/lead-errors";

describe("Enquiry failure diagnostics", () => {
  it("identifies permission failures without reporting success", () => {
    expect(leadErrorMessage({ code: "42501" })).toContain("42501");
  });
  it("identifies missing columns", () => {
    expect(leadErrorMessage({ code: "PGRST204" })).toContain("PGRST204");
  });
  it("handles connection failures without exposing raw error details", () => {
    expect(leadErrorMessage(null)).not.toContain("undefined");
  });
});