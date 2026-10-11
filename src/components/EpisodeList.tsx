import type { Episode } from "@/lib/episodes";
import EpisodeCard from "./EpisodeCard";

export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
  if (episodes.length === 0) {
    return (
      <p role="status" data-testid="empty-catalog">
        No episodes yet — check back soon.
      </p>
    );
  }
  return (
    <ul data-testid="episode-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </ul>
  );
}
