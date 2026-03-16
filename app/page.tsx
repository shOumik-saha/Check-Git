"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

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

type HistoryItem = {
  id: string;
  url: string;
  repo_name: string;
  checked_at: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadingSteps = [
    "Fetching repository data...",
    "Parsing code structure...",
    "Running AI analysis...",
    "Generating recommendations...",
  ];

  // Fetch history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const { data } = await supabase
      .from("repo_history")
      .select("*")
      .order("checked_at", { ascending: false })
      .limit(10);
    if (data) setHistory(data);
  }

  async function handleAnalyze() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setRepoData(null);
    setAnalysis(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 1200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setRepoData(data.repoData);
      setAnalysis(data.analysis);

      // Refresh history after new analysis
      await fetchHistory();
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  return (
    <main className={styles.main}>
      {/* Background grid */}
      <div className={styles.grid} />
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Check<span className={styles.accent}>Git</span>
        </h1>
        <p className={styles.subtitle}>
          Drop any GitHub URL. Get instant AI-powered insights on tech stack,
          strengths & improvements.
        </p>
      </header>

      {/* Input */}
      <section className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </span>
          <input
            className={styles.input}
            type="text"
            placeholder="https://github.com/username/repository"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button
            className={styles.btn}
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                Analyze
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Loading steps */}
        {loading && (
          <div className={styles.loadingSteps}>
            {loadingSteps.map((step, i) => (
              <div
                key={i}
                className={`${styles.step} ${i <= loadingStep ? styles.stepActive : ""} ${i === loadingStep ? styles.stepCurrent : ""}`}
              >
                <span className={styles.stepDot} />
                {step}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      </section>

      {/* Recent History */}
      {history.length > 0 && (
        <section className={styles.history}>
          <div className={styles.historyTitle}>
            <span>⟳</span> Recently Analyzed
          </div>
          {history.map((item) => (
            <div
              key={item.id}
              className={styles.historyItem}
              onClick={() => setUrl(item.url)}
            >
              <div className={styles.historyRepo}>{item.repo_name}</div>
              <div className={styles.historyMeta}>
                {timeAgo(item.checked_at)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Results */}
      {repoData && analysis && (
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
              <Stat icon="★" label="Stars" value={repoData.stars.toLocaleString()} color="var(--accent3)" />
              <Stat icon="⑂" label="Forks" value={repoData.forks.toLocaleString()} color="var(--accent2)" />
              <Stat icon="◉" label="Watchers" value={repoData.watchers.toLocaleString()} color="#06b6d4" />
              <Stat icon="!" label="Issues" value={repoData.openIssues.toLocaleString()} color="#f87171" />
            </div>

            <div className={styles.meta}>
              {repoData.language && (
                <span className={styles.metaItem}>
                  <span className={styles.langDot} />
                  {repoData.language}
                </span>
              )}
              {repoData.license && (
                <span className={styles.metaItem}>⚖ {repoData.license}</span>
              )}
              <span className={styles.metaItem}>⏱ Updated {timeAgo(repoData.updatedAt)}</span>
              <span className={styles.metaItem}>📅 Created {timeAgo(repoData.createdAt)}</span>
            </div>
          </div>

          {/* AI Summary */}
          <div className={`${styles.card} ${styles.summaryCard}`}>
            <div className={styles.cardLabel}>
              <span className={styles.cardLabelIcon}>◈</span> AI SUMMARY
            </div>
            <p className={styles.summaryText}>{analysis.summary}</p>
          </div>

          {/* 3-column grid */}
          <div className={styles.cardGrid}>
            {/* Tech Stack */}
            <div className={styles.card}>
              <div className={styles.cardLabel}>
                <span className={styles.cardLabelIcon} style={{ color: "#06b6d4" }}>⬡</span>
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
                <span className={styles.cardLabelIcon} style={{ color: "var(--accent)" }}>▲</span>
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
                <span className={styles.cardLabelIcon} style={{ color: "var(--accent3)" }}>⚡</span>
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
        </section>
      )}
    </main>
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
