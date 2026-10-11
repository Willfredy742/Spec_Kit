import { describe, expect, it } from "vitest";
import { formatDuration, formatPublishedAt, getEpisodes, validateCatalog } from "@/lib/episodes";

const validEpisode = {
  id: "ep-001-test",
  title: "Test episode",
  description: "A test episode description.",
  publishedAt: "2026-01-01",
  durationSeconds: 600,
  audioUrl: "/audio/ep-001-test.wav",
};

describe("validateCatalog", () => {
  it("accepts a valid catalog", () => {
    const episodes = validateCatalog([validEpisode]);
    expect(episodes).toHaveLength(1);
    expect(episodes[0].id).toBe("ep-001-test");
  });

  it("rejects duplicate ids", () => {
    expect(() => validateCatalog([validEpisode, { ...validEpisode }])).toThrow(
      /Duplicate episode id/,
    );
  });

  it("rejects absolute audio URLs", () => {
    expect(() =>
      validateCatalog([{ ...validEpisode, audioUrl: "https://cdn.example.com/a.mp3" }]),
    ).toThrow(/audioUrl/);
  });

  it("rejects invalid dates", () => {
    expect(() =>
      validateCatalog([{ ...validEpisode, publishedAt: "01/01/2026" }]),
    ).toThrow(/publishedAt/);
  });

  it("rejects non-slug ids", () => {
    expect(() => validateCatalog([{ ...validEpisode, id: "Not A Slug" }])).toThrow(/id/);
  });

  it("rejects empty titles", () => {
    expect(() => validateCatalog([{ ...validEpisode, title: "" }])).toThrow(/title/);
  });

  it("rejects non-positive durations", () => {
    expect(() =>
      validateCatalog([{ ...validEpisode, durationSeconds: 0 }]),
    ).toThrow(/durationSeconds/);
  });

  it("rejects non-array catalogs", () => {
    expect(() => validateCatalog({ episodes: [] })).toThrow(/array/);
  });
});

describe("getEpisodes", () => {
  it("returns the seeded catalog sorted newest first", () => {
    const episodes = getEpisodes();
    expect(episodes.length).toBeGreaterThanOrEqual(1);
    const dates = episodes.map((e) => e.publishedAt);
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(sorted);
  });

  it("returns an empty array when the catalog is empty (edge case)", () => {
    expect(validateCatalog([])).toEqual([]);
  });
});

describe("formatters", () => {
  it("formats durations as minutes", () => {
    expect(formatDuration(600)).toBe("10 min");
  });

  it("formats ISO dates for display", () => {
    expect(formatPublishedAt("2026-10-01")).toBe("Oct 1, 2026");
  });
});
