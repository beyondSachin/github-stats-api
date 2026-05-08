import { GitHubError } from "./types.js";
import type { GitHubRepo, GitHubUser } from "./types.js";

const BASE_URL = "https://api.github.com";
const TIMEOUT_MS = 10_000;

const getHeaders = (token?: string): Record<string, string> => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
  "User-Agent": "github-stats-api/1.0",
});

function getNextPageUrl(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  for (const link of linkHeader.split(",")) {
    const [urlPart, relPart] = link.split(";");
    if (relPart?.includes('rel="next"')) {
      const match = urlPart?.trim().match(/^<(.+)>$/);
      return match?.[1] ?? null;
    }
  }
  return null;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkResponse(res: Response, context: string): Promise<void> {
  if (res.ok) return;
  if (res.status === 404) throw new GitHubError(`${context}: not found`, 404);
  if (res.status === 403) throw new GitHubError(`${context}: rate limited`, 429);
  if (res.status === 401) throw new GitHubError(`${context}: unauthorized`, 401);
  throw new GitHubError(`${context}: failed (${res.status})`, res.status);
}

export async function getUserData(
  username: string,
  token?: string
): Promise<GitHubUser> {
  const res = await fetchWithTimeout(`${BASE_URL}/users/${username}`, {
    headers: getHeaders(token),
  });
  await checkResponse(res, "GitHub user fetch");
  return res.json() as Promise<GitHubUser>;
}

export async function getRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let url: string | null = `${BASE_URL}/users/${username}/repos?per_page=100`;

  while (url) {
    const res = await fetchWithTimeout(url, {
      headers: getHeaders(token),
    });
    await checkResponse(res, "GitHub repos fetch");
    repos.push(...(await (res.json() as Promise<GitHubRepo[]>)));
    url = getNextPageUrl(res.headers.get("Link"));
  }

  return repos;
}
