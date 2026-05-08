import { describe, it, expect } from "vitest";
import { generateSVG, generateCompactSVG } from "./svg.js";
import type { Stats } from "./types.js";
import type { ThemeColors } from "./themes.js";

const mockTheme: ThemeColors = {
  bg: "#0d1117",
  border: "#30363d",
  title: "#58a6ff",
  text: "#c9d1d9",
  accent: "#8b949e",
  card: "#161b22",
};

const mockStats: Stats = {
  name: "Test User",
  joined: "2020",
  totalRepos: 10,
  stars: 42,
  forks: 7,
  followers: 100,
  following: 50,
  publicGists: 5,
  topLanguages: [["TypeScript", 5]],
  mostStarredRepo: {
    name: "awesome-project",
    stargazers_count: 100,
    forks_count: 20,
    language: "TypeScript",
    description: "An awesome project",
  },
};

describe("generateSVG", () => {
  it("returns a valid SVG string", () => {
    const svg = generateSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("includes the username and display name", () => {
    const svg = generateSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("Test User");
    expect(svg).toContain("testuser");
  });

  it("includes stats numbers", () => {
    const svg = generateSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("Stars: 42");
    expect(svg).toContain("Forks: 7");
  });

  it("escapes XML special characters in name", () => {
    const evilStats = {
      ...mockStats,
      name: '<script>alert("xss")</script>',
    };
    const svg = generateSVG("attacker", evilStats, mockTheme);
    expect(svg).toContain("&lt;script&gt;");
    expect(svg).not.toContain("<script>");
  });

  it("escapes XML in username", () => {
    const svg = generateSVG('foo"bar', mockStats, mockTheme);
    expect(svg).toContain("foo&quot;bar");
  });

  it("escapes XML in repo names", () => {
    const evilStats = {
      ...mockStats,
      mostStarredRepo: {
        ...mockStats.mostStarredRepo!,
        name: 'repo&<script>',
      },
    };
    const svg = generateSVG("testuser", evilStats, mockTheme);
    expect(svg).toContain("repo&amp;&lt;script&gt;");
    expect(svg).not.toContain("<script>");
  });

  it("shows most starred repo section", () => {
    const svg = generateSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("Most Starred Repository");
    expect(svg).toContain("awesome-project");
  });

  it("omits most starred repo section when null", () => {
    const stats = { ...mockStats, mostStarredRepo: null };
    const svg = generateSVG("testuser", stats, mockTheme);
    expect(svg).not.toContain("Most Starred Repository");
  });

  it("includes language information", () => {
    const svg = generateSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("TypeScript");
    expect(svg).toContain("5 repos");
  });
});

describe("generateCompactSVG", () => {
  it("returns a valid SVG string", () => {
    const svg = generateCompactSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("includes compact label", () => {
    const svg = generateCompactSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("Compact Stats");
  });

  it("includes stats", () => {
    const svg = generateCompactSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("Stars: 42");
    expect(svg).toContain("Forks: 7");
  });

  it("shows top language", () => {
    const svg = generateCompactSVG("testuser", mockStats, mockTheme);
    expect(svg).toContain("TypeScript");
  });

  it("shows N/A when no top languages", () => {
    const stats = { ...mockStats, topLanguages: [] };
    const svg = generateCompactSVG("testuser", stats, mockTheme);
    expect(svg).toContain("N/A");
  });

  it("escapes XML in compact view", () => {
    const evilStats = {
      ...mockStats,
      name: '<evil>name</evil>',
    };
    const svg = generateCompactSVG("testuser", evilStats, mockTheme);
    expect(svg).toContain("&lt;evil&gt;");
    expect(svg).not.toContain("<evil>");
  });
});
