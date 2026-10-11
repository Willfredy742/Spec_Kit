import type { Episode } from "@/lib/episodes";
import { formatDuration, formatPublishedAt } from "@/lib/episodes";
import styles from "./episode-card.module.css";

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <li className={styles.card}>
      <div className={styles.body}>
        <h2 className={styles.title}>{episode.title}</h2>
        <p className={styles.meta}>
          <time dateTime={episode.publishedAt}>
            {formatPublishedAt(episode.publishedAt)}
          </time>
          {" · "}
          <span>{formatDuration(episode.durationSeconds)}</span>
        </p>
        <p className={styles.description}>{episode.description}</p>
      </div>
      {episode.coverImageUrl ? (
        <img
          className={styles.cover}
          src={episode.coverImageUrl}
          alt={`Cover art for ${episode.title}`}
          width={96}
          height={96}
        />
      ) : null}
    </li>
  );
}
