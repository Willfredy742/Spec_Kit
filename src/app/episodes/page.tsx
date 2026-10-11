import EpisodeList from "@/components/EpisodeList";
import { getEpisodes } from "@/lib/episodes";

export default function EpisodesPage() {
  const episodes = getEpisodes();
  return (
    <>
      <h1>Episodes</h1>
      <EpisodeList episodes={episodes} />
    </>
  );
}
