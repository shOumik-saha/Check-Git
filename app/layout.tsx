import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CheckGit — GitHub Repo Analyzer",
  description: "Analyze any GitHub repository with AI. Get instant insights on tech stack, strengths, and improvements.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
