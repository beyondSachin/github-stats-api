export class GitHubError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

export interface GitHubUser {
  login: string;
  name: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  description: string | null;
}

export interface Stats {
  name: string;
  joined: string;
  totalRepos: number;
  stars: number;
  forks: number;
  followers: number;
  following: number;
  publicGists: number;
  topLanguages: [string, number][];
  mostStarredRepo: GitHubRepo | null;
}
