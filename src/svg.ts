import type { Stats } from "./types.js";
import type { ThemeColors } from "./themes.js";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getStyles(theme: ThemeColors) {
  return `
    .title { font: bold 18px sans-serif; fill: ${theme.title}; }
    .title-small { font: bold 14px sans-serif; fill: ${theme.title}; }
    .text { font: 12px sans-serif; fill: ${theme.text}; }
    .text-bold { font: bold 13px sans-serif; fill: ${theme.text}; }
    .text-small { font: 10px sans-serif; fill: ${theme.accent}; }
  `;
}

export function generateSVG(
  username: string,
  stats: Stats,
  theme: ThemeColors
): string {
  const safeName = escapeXml(stats.name);
  const safeUsername = escapeXml(username);

  const languageList = stats.topLanguages
    .map(
      ([lang, count], i) =>
        `<text x="240" y="${100 + i * 20}" class="text">${escapeXml(lang)} (${count} repos)</text>`
    )
    .join("");

  const mostStarredRepoBox = stats.mostStarredRepo
    ? `
  <rect x="20" y="210" width="380" height="70" rx="8" fill="${theme.card}" stroke="${theme.border}" />
  <text x="35" y="235" class="title-small">Most Starred Repository</text>
  <text x="35" y="255" class="text-bold">${escapeXml(stats.mostStarredRepo.name)}</text>
  <text x="35" y="270" class="text-small">${escapeXml((stats.mostStarredRepo.description || "No description").substring(0, 60))}${(stats.mostStarredRepo.description?.length || 0) > 60 ? "..." : ""}</text>
  <text x="340" y="255" class="text">&star; ${stats.mostStarredRepo.stargazers_count}</text>
  `
    : "";

  return `<svg width="420" height="300" xmlns="http://www.w3.org/2000/svg">
  <style>${getStyles(theme)}</style>

  <rect width="100%" height="100%" fill="${theme.bg}" rx="12" stroke="${theme.border}"/>

  <text x="20" y="35" class="title">${safeName}'s Stats</text>
  <text x="20" y="55" class="text-small">@${safeUsername} &bull; Joined ${stats.joined}</text>

  <g transform="translate(20, 80)">
    <text x="0" y="0" class="text">Repos: ${stats.totalRepos}</text>
    <text x="0" y="20" class="text">Stars: ${stats.stars}</text>
    <text x="0" y="40" class="text">Forks: ${stats.forks}</text>

    <text x="110" y="0" class="text">Followers: ${stats.followers}</text>
    <text x="110" y="20" class="text">Following: ${stats.following}</text>
    <text x="110" y="40" class="text">Gists: ${stats.publicGists}</text>
  </g>

  <text x="240" y="80" class="title-small">Top Languages</text>
  ${languageList}

  ${mostStarredRepoBox}
</svg>`;
}

export function generateCompactSVG(
  _username: string,
  stats: Stats,
  theme: ThemeColors
): string {
  const safeName = escapeXml(stats.name);

  return `<svg width="300" height="120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: bold 14px sans-serif; fill: ${theme.title}; }
    .text { font: 11px sans-serif; fill: ${theme.text}; }
    .text-bold { font: bold 12px sans-serif; fill: ${theme.text}; }
  </style>

  <rect width="100%" height="100%" fill="${theme.bg}" rx="10" stroke="${theme.border}"/>

  <text x="15" y="25" class="title">${safeName}'s Compact Stats</text>

  <text x="15" y="55" class="text">Repos: ${stats.totalRepos}</text>
  <text x="15" y="75" class="text">Stars: ${stats.stars}</text>
  <text x="15" y="95" class="text">Forks: ${stats.forks}</text>

  <text x="120" y="55" class="text">Followers: ${stats.followers}</text>
  <text x="120" y="75" class="text">Following: ${stats.following}</text>
  <text x="120" y="95" class="text">Joined: ${stats.joined}</text>

  <text x="215" y="55" class="text">Top Lang:</text>
  <text x="215" y="75" class="text-bold">${escapeXml(stats.topLanguages[0]?.[0] || "N/A")}</text>
</svg>`;
}
