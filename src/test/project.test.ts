import { describe, expect, it } from "vitest";
import { project } from "@/lib/project";

describe("Source project details", () => {
  it("uses the owner's starting price", () => {
    expect(project.startingPrice).toBe("₹1.73 Cr* Onwards");
  });
  it("uses the owner's 1,735 sq. ft. price range", () => {
    expect(project.homes.find(home => home.area === 1735)?.price).toBe("₹1.73 Cr – ₹1.85 Cr Onwards");
  });
  it("uses the owner's 1,926 sq. ft. price range", () => {
    expect(project.homes.find(home => home.area === 1926)?.price).toBe("₹1.92 Cr – ₹2.05 Cr Onwards");
  });
  it("uses the owner's 1,945 sq. ft. price range", () => {
    expect(project.homes.find(home => home.area === 1945)?.price).toBe("₹1.95 Cr – ₹2.10 Cr Onwards");
  });
  it("preserves the source development figures", () => {
    expect([project.acres, project.clubhouseSqFt, project.amenities, project.openSpacePercent]).toEqual([11, 62000, 30, 81]);
  });
  it("preserves the airport travel estimate", () => {
    expect(project.destinations.find(([name]) => name === "Kempegowda International Airport")?.[1]).toBe("~40–50 min");
  });
  it("points the WhatsApp button at the owner's number", () => {
    expect(project.whatsapp.phone).toBe("919071371005");
    expect(project.whatsapp.message).toContain("Assetz Codename Sublime");
  });
});