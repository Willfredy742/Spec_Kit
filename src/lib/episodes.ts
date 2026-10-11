import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import catalog from "@/content/episodes.json";

export interface Episode {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  audioUrl: string;
  coverImageUrl?: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const RELATIVE_URL_PATTERN = /^\/(audio|media)\//;

function fail(id: string | undefined, message: string): never {
  throw new Error(`Invalid episode "${id ?? "<unknown>"}": ${message}`);
}

function validateEpisode(raw: unknown): Episode {
  if (typeof raw !== "object" || raw === null) {
    fail(undefined, "not an object");
  }
  const e = raw as Record<string, unknown>;
  const id = typeof e.id === "string" ? e.id : fail(String(e.id), "id must be a string");

  if (!SLUG_PATTERN.test(id)) {
    fail(id, "id must match ^[a-z0-9]+(-[a-z0-9]+)*$");
  }
  if (typeof e.title !== "string" || e.title.length < 1 || e.title.length > 200) {
    fail(id, "title must be a string of 1-200 chars");
  }
  if (
    typeof e.description !== "string" ||
    e.description.length < 1 ||
    e.description.length > 2000
  ) {
    fail(id, "description must be a string of 1-2000 chars");
  }
  if (typeof e.publishedAt !== "string" || !ISO_DATE_PATTERN.test(e.publishedAt)) {
    fail(id, "publishedAt must be an ISO date (YYYY-MM-DD)");
  }
  if (!Number.isInteger(e.durationSeconds) || (e.durationSeconds as number) <= 0) {
    fail(id, "durationSeconds must be an integer > 0");
  }
  if (typeof e.audioUrl !== "string" || !RELATIVE_URL_PATTERN.test(e.audioUrl)) {
    fail(id, "audioUrl must be a site-relative path starting with /audio/ or /media/");
  }
  if (e.coverImageUrl !== undefined && typeof e.coverImageUrl !== "string") {
    fail(id, "coverImageUrl must be a string when present");
  }

  return {
    id,
    title: e.title,
    description: e.description,
    publishedAt: e.publishedAt,
    durationSeconds: e.durationSeconds as number,
    audioUrl: e.audioUrl,
    ...(typeof e.coverImageUrl === "string" ? { coverImageUrl: e.coverImageUrl } : {}),
  };
}

export function validateCatalog(raw: unknown): Episode[] {
  if (!Array.isArray(raw)) {
    throw new Error("Episode catalog must be an array");
  }
  const episodes = raw.map(validateEpisode);
  const seen = new Set<string>();
  for (const episode of episodes) {
    if (seen.has(episode.id)) {
      throw new Error(`Duplicate episode id: "${episode.id}"`);
    }
    seen.add(episode.id);
  }
  return episodes;
}

export function getEpisodes(): Episode[] {
  const episodes = validateCatalog(catalog);
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
    const publicDir = join(process.cwd(), "public");
    for (const episode of episodes) {
      if (!existsSync(join(publicDir, episode.audioUrl))) {
        throw new Error(
          `Episode "${episode.id}" audioUrl "${episode.audioUrl}" is missing from public/`,
        );
      }
    }
  }
  return [...episodes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes} min`;
}

export function formatPublishedAt(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
