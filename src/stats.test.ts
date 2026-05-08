import { describe, it, expect } from "vitest";
import { calculateStats } from "./stats.js";
import type { GitHubUser, GitHubRepo } from "./types.js";

const mockUser: GitHubUser = {
  login: "testuser",
  name: "Test User",
  followers: 100,
  following: 50,
  public_repos: 10,
  public_gists: 5,
  created_at: "2020-01-15T00:00:00Z",
};

function makeRepo(
  overrides: Partial<GitHubRepo> = {}
): GitHubRepo {
  return {
    name: "repo",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    description: "A test repo",
    ...overrides,
  };
}

describe("calculateStats", () => {
  it("calculates total stars and forks", () => {
    const repos = [
      makeRepo({ stargazers_count: 10, forks_count: 2 }),
      makeRepo({ stargazers_count: 5, forks_count: 1 }),
    ];
    const stats = calculateStats(mockUser, repos);
    expect(stats.stars).toBe(15);
    expect(stats.forks).toBe(3);
  });

  it("identifies the most starred repo", () => {
    const repos = [
      makeRepo({ name: "alpha", stargazers_count: 5 }),
      makeRepo({ name: "beta", stargazers_count: 20 }),
      makeRepo({ name: "gamma", stargazers_count: 10 }),
    ];
    const stats = calculateStats(mockUser, repos);
    expect(stats.mostStarredRepo?.name).toBe("beta");
    expect(stats.mostStarredRepo?.stargazers_count).toBe(20);
  });

  it("tallies top languages by repo count", () => {
    const repos = [
      makeRepo({ language: "TypeScript" }),
      makeRepo({ language: "TypeScript" }),
      makeRepo({ language: "Rust" }),
      makeRepo({ language: "Python" }),
      makeRepo({ language: "Rust" }),
      makeRepo({ language: "Go" }),
    ];
    const stats = calculateStats(mockUser, repos);
    expect(stats.topLanguages[0]).toEqual(["TypeScript", 2]);
    expect(stats.topLanguages[1]).toEqual(["Rust", 2]);
    expect(stats.topLanguages[2]).toEqual(["Python", 1]);
    expect(stats.topLanguages[3]).toEqual(["Go", 1]);
  });

  it("limits top languages to 5", () => {
    const languages = ["TS", "Rust", "Go", "Python", "Java", "Ruby", "C++"];
    const repos = languages.map((lang) => makeRepo({ language: lang }));
    const stats = calculateStats(mockUser, repos);
    expect(stats.topLanguages.length).toBe(5);
  });

  it("uses login as fallback when name is null", () => {
    const user = { ...mockUser, name: null };
    const stats = calculateStats(user, []);
    expect(stats.name).toBe("testuser");
  });

  it("extracts joined year from created_at", () => {
    const stats = calculateStats(mockUser, []);
    expect(stats.joined).toBe("2020");
  });

  it("handles repos with null language", () => {
    const repos = [
      makeRepo({ language: null }),
      makeRepo({ language: "TypeScript" }),
    ];
    const stats = calculateStats(mockUser, repos);
    expect(stats.topLanguages).toEqual([["TypeScript", 1]]);
  });

  it("handles empty repos array", () => {
    const stats = calculateStats(mockUser, []);
    expect(stats.stars).toBe(0);
    expect(stats.forks).toBe(0);
    expect(stats.mostStarredRepo).toBeNull();
    expect(stats.topLanguages).toEqual([]);
  });

  it("handles empty top languages when no language data", () => {
    const repos = [makeRepo({ language: null }), makeRepo({ language: null })];
    const stats = calculateStats(mockUser, repos);
    expect(stats.topLanguages).toEqual([]);
  });

  it("returns correct user metadata", () => {
    const stats = calculateStats(mockUser, []);
    expect(stats.totalRepos).toBe(10);
    expect(stats.followers).toBe(100);
    expect(stats.following).toBe(50);
    expect(stats.publicGists).toBe(5);
  });

  it("handles multiple repos with same star count", () => {
    const repos = [
      makeRepo({ name: "first", stargazers_count: 5 }),
      makeRepo({ name: "second", stargazers_count: 5 }),
    ];
    const stats = calculateStats(mockUser, repos);
    expect(stats.mostStarredRepo?.name).toBe("first");
  });
});
