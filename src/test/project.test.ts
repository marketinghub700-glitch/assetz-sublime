import { describe, expect, it } from "vitest";
import { project } from "@/lib/project";

describe("Source project details", () => {
  it("preserves the source starting price", () => {
    expect(project.startingPrice).toBe("₹1.84 Cr* Onwards");
  });
  it("preserves each saleable area and indicative price range", () => {
    expect(project.homes).toEqual([
      { area: 1735, price: "₹1.84 Cr – ₹2.02 Cr Onwards" },
      { area: 1926, price: "₹2.02 Cr – ₹2.20 Cr Onwards" },
      { area: 1945, price: "₹2.04 Cr – ₹2.22 Cr Onwards" },
    ]);
  });
  it("preserves the source development figures", () => {
    expect([project.acres, project.clubhouseSqFt, project.amenities, project.openSpacePercent]).toEqual([11, 62000, 30, 81]);
  });
  it("preserves the airport travel estimate", () => {
    expect(project.destinations.find(([name]) => name === "Kempegowda International Airport")?.[1]).toBe("~40–50 min");
  });
});