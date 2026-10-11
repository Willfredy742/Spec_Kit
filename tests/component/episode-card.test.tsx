import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EpisodeCard from "@/components/EpisodeCard";
import type { Episode } from "@/lib/episodes";

const baseEpisode: Episode = {
  id: "ep-001-test",
  title: "Test episode",
  description: "A short description of the test episode.",
  publishedAt: "2026-10-01",
  durationSeconds: 2145,
  audioUrl: "/audio/ep-001-test.wav",
};

describe("EpisodeCard", () => {
  it("renders title, date, duration, and description", () => {
    render(<EpisodeCard episode={baseEpisode} />);
    expect(
      screen.getByRole("heading", { name: "Test episode" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Oct 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("36 min")).toBeInTheDocument();
    expect(
      screen.getByText("A short description of the test episode."),
    ).toBeInTheDocument();
  });

  it("renders without artwork when coverImageUrl is absent", () => {
    render(<EpisodeCard episode={baseEpisode} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders artwork with descriptive alt text when present", () => {
    render(
      <EpisodeCard
        episode={{ ...baseEpisode, coverImageUrl: "/cover/ep-001.svg" }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Cover art for Test episode" }),
    ).toBeInTheDocument();
  });

  it("truncates very long titles and descriptions without failing", () => {
    render(
      <EpisodeCard
        episode={{
          ...baseEpisode,
          title: "x".repeat(200),
          description: "y".repeat(2000),
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "x".repeat(200) })).toBeInTheDocument();
  });
});
