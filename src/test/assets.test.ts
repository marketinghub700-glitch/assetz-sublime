import { describe, expect, it } from "vitest";
import { hostedAsset } from "@/lib/assets";

describe("Portable project images", () => {
  it("loads Lovable asset paths from the image host rather than the Vercel origin", () => {
    expect(hostedAsset({ url: "/__l5e/assets-v1/example/plan.webp" }).url).toBe(
      "https://assetz-sublime.lovable.app/__l5e/assets-v1/example/plan.webp",
    );
  });

  it("preserves already absolute image URLs", () => {
    const url = "https://images.example.com/plan.webp";
    expect(hostedAsset({ url }).url).toBe(url);
  });

  it("preserves ordinary local image paths", () => {
    expect(hostedAsset({ url: "/images/plan.webp" }).url).toBe("/images/plan.webp");
  });
});