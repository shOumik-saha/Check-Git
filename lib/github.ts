import axios from "axios";

export async function getRepoInfo(repoUrl: string) {
  const urlParts = repoUrl.split("github.com/");
  if (urlParts.length < 2 || !urlParts[1]) {
    throw new Error("Invalid GitHub URL");
  }
  const repoParts = urlParts[1].replace(/\/$/, "").split("/");
  const owner = repoParts[0];
  const repo = repoParts[1];
  if (!owner || !repo) throw new Error("Invalid GitHub URL format");

  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: process.env.GITHUB_TOKEN
        ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        : {},
    }
  );
  return response.data;
}

export function analyzeRepo(repo: any) {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    language: repo.language,
    topics: repo.topics || [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    openIssues: repo.open_issues_count,
    license: repo.license?.name || null,
    homepage: repo.homepage || null,
  };
}
