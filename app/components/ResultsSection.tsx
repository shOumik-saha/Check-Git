"use client";
import styles from "../page.module.css";

type RepoData = {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  topics: string[];
  openIssues: number;
  license: string | null;
  homepage: string | null;
  createdAt: string;
  updatedAt: string;
};

type Analysis = {
  summary: string;
  techStack: string[];
  strengths: string[];
  improvements: string[];
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function ResultsSection({
  repoData,
  analysis,
}: {
  repoData: RepoData;
  analysis: Analysis;
}) {
  return (
    <section className={styles.results}>
      {/* Repo header card */}
      <div className={styles.repoCard}>
        <div className={styles.repoTop}>
          <div>
            <div className={styles.repoName}>{repoData.fullName}</div>
            {repoData.description && (
              <p className={styles.repoDesc}>{repoData.description}</p>
            )}
            {repoData.topics.length > 0 && (
              <div className={styles.topics}>
                {repoData.topics.map((t) => (
                  <span key={t} className={styles.topic}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.stats}>
          <Stat icon="" label="Stars" value={repoData.stars.toLocaleString()} color="var(--accent3)" />
          <Stat icon="" label="Forks" value={repoData.forks.toLocaleString()} color="var(--accent2)" />
          <Stat icon="" label="Watchers" value={repoData.watchers.toLocaleString()} color="#06b6d4" />
          <Stat icon="" label="Issues" value={repoData.openIssues.toLocaleString()} color="#f87171" />
        </div>

        <div className={styles.meta}>
          {repoData.language && (
            <span className={styles.metaItem}>
              <span className={styles.langDot} />
              {repoData.language}
            </span>
          )}
          {repoData.license && (
            <span className={styles.metaItem}>License: {repoData.license}</span>
          )}
          <span className={styles.metaItem}>Updated {timeAgo(repoData.updatedAt)}</span>
          <span className={styles.metaItem}>Created {timeAgo(repoData.createdAt)}</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className={`${styles.card} ${styles.summaryCard}`}>
        <div className={styles.cardLabel}>
          <span className={styles.cardLabelIcon}>*</span> AI SUMMARY
        </div>
        <p className={styles.summaryText}>{analysis.summary}</p>
      </div>

      {/* 3-column grid */}
      <div className={styles.cardGrid}>
        {/* Tech Stack */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <span className={styles.cardLabelIcon} style={{ color: "#06b6d4" }}>*</span>
            TECH STACK
          </div>
          <ul className={styles.list}>
            {analysis.techStack.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.listBullet} style={{ background: "#06b6d4" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Strengths */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <span className={styles.cardLabelIcon} style={{ color: "var(--accent)" }}>^</span>
            STRENGTHS
          </div>
          <ul className={styles.list}>
            {analysis.strengths.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.listBullet} style={{ background: "var(--accent)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            <span className={styles.cardLabelIcon} style={{ color: "var(--accent3)" }}>!</span>
            IMPROVEMENTS
          </div>
          <ul className={styles.list}>
            {analysis.improvements.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.listBullet} style={{ background: "var(--accent3)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.footer}>
        Powered by <span className={styles.accentText}>Groq LLaMA 3.3</span> + <span className={styles.accentText}>GitHub API</span>
      </div>
    </section>
  );
}

function Stat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statIcon} style={{ color }}>{icon}</span>
      <div>
        <div className={styles.statValue} style={{ color }}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}