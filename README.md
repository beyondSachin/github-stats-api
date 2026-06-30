# GitHub Stats API

[![CI](https://github.com/sachinksamad1/github-stats-api/actions/workflows/ci.yml/badge.svg)](https://github.com/sachinksamad1/github-stats-api/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fast, customizable, and developer-friendly **TypeScript API** that generates dynamic SVG GitHub stats — designed for reliability, extensibility, and clean architecture.

> Built for developers who want control — not dependency on fragile third-party deployments.

---

## Why this exists

Most GitHub stats services:

- break due to rate limits
- depend on shared infrastructure
- lack extensibility

This project solves that by giving you:

- full ownership
- predictable performance
- a clean foundation to extend

---

## Features

- **Rich GitHub Metrics**
  - Repositories, Stars, Forks
  - Followers / Following
  - Public Gists
  - Most Starred Repository
  - Joined Year

- **Theme System**
  - Built-in themes: `github` (default), `ocean`, `forest`, `sunset`, `dracula`
  - Fully overrideable via query params

- **Composable Design**
  - Separate layers: `data → aggregation → rendering`
  - Easy to extend (add metrics, layouts, themes)

- **Flexible Layouts**
  - `default` (detailed card)
  - `compact` (minimal footprint)

- **Production-grade**
  - Full repo pagination (fetches all pages)
  - Request timeout (10s) on GitHub API calls
  - SVG injection protection (XML escaping)
  - Username validation with descriptive errors
  - Typed error responses (404, 429, 401, 5xx)
  - CORS headers included
  - Health check endpoint
  - Cache headers included

- **Modern Stack**
  - TypeScript (strict mode)
  - Native Fetch API (no axios, no dotenv)
  - Node.js 18+ / Edge-compatible

---

## Architecture

```text
Request → GitHub API → Stats Engine → SVG Renderer → Response
```

| Layer       | Responsibility                                   |
| ----------- | ------------------------------------------------ |
| `types.ts`  | Shared types & error classes                     |
| `github.ts` | Fetch GitHub data (with pagination & timeout)    |
| `stats.ts`  | Aggregate & compute                              |
| `svg.ts`    | Render visual output (with XML escaping)         |
| `server.ts` | API interface (validation, error handling, CORS) |

---

## API Reference

### `GET /api?username=<user>`

Returns an SVG image with GitHub stats.

**Query Parameters**

| Param      | Type     | Default   | Description                                                  |
| ---------- | -------- | --------- | ------------------------------------------------------------ |
| `username` | `string` | —         | GitHub username (required, validated)                        |
| `theme`    | `string` | `github`  | Theme name: `github`, `ocean`, `forest`, `sunset`, `dracula` |
| `layout`   | `string` | `default` | Layout: `default` or `compact`                               |
| `bg`       | `string` | theme     | Background color (hex, with or without `#`)                  |
| `border`   | `string` | theme     | Card border color                                            |
| `title`    | `string` | theme     | Heading color                                                |
| `text`     | `string` | theme     | Main text color                                              |
| `accent`   | `string` | theme     | Secondary text color                                         |
| `card`     | `string` | theme     | Highlight card color                                         |

**Error Responses**

| Status | Meaning                                 |
| ------ | --------------------------------------- |
| `400`  | Missing or invalid `username` parameter |
| `401`  | GitHub token is unauthorized            |
| `404`  | GitHub user not found                   |
| `429`  | GitHub API rate limit exceeded          |
| `500`  | Unexpected server error                 |

**Examples**

```bash
# Default
/api?username=octocat

# Themed
/api?username=octocat&theme=dracula

# Compact layout
/api?username=octocat&layout=compact

# Custom colors
/api?username=octocat&bg=0d1117&title=58a6ff&text=c9d1d9
```

### `GET /health`

Returns a simple health check.

```json
{ "status": "ok" }
```

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/beyondSachin/github-stats-api.git
cd github-stats-api
```

### 2. Install

```bash
npm install
```

### 3. Generate a GitHub Token

This API requires a GitHub Personal Access Token to avoid rate limits.

1. Go to [GitHub Tokens Settings](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name (e.g., `github-stats-api`)
4. Set expiration as desired (no expiry is fine for self-hosted)
5. **No scopes needed** — the API only accesses public data, so leave all checkboxes unchecked
6. Click **Generate token** and copy the token

> Your token is shown only once. Store it securely.

### 4. Configure

Create `.env` (only for local development):

```env
GITHUB_TOKEN=your_token_here
PORT=3000
```

### 5. Run

```bash
npm run dev
```

Test:

```bash
http://localhost:3000/api?username=your-username
http://localhost:3000/health
```

---

## Deployment

### Vercel (Recommended)

1. Fork repo
2. Import into Vercel
3. Add env variable:

   ```
   GITHUB_TOKEN=your_token
   ```

4. Deploy

---

## Usage in README

```markdown
![GitHub Stats](https://your-app.vercel.app/api?username=your-username)
```

---

## Example Variants

```markdown
# Theme

![Stats](...&theme=dracula)

# Compact

![Stats](...&layout=compact)

# Custom

![Stats](...&bg=0d1117&title=58a6ff)
```

---

## Testing

```bash
npm test        # Run tests once
npm run test:watch  # Watch mode
```

The test suite covers:

- **Stats computation** — star/fork totals, most starred repo, language tallying, edge cases (null fields, empty repos)
- **SVG rendering** — valid XML output, escaping of user-provided content, layout-specific elements

---

## Extending the Project

This project is intentionally designed for extension.

### Add new stats

Edit:

```text
src/stats.ts
```

Examples:

- commit count
- PR count
- issue stats
- contribution streaks

### Add new theme

Edit:

```text
src/themes.ts
```

### Add new layout

Edit:

```text
src/svg.ts
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

---

## Limitations

- No historical contribution data (without GraphQL)
- Rate limits without token (~60/hr)

---

## Best Practices

- Always use a `GITHUB_TOKEN`
- Enable caching (already configured)
- Self-host for reliability

---

## License

MIT — use it, modify it, build on top of it.

---

## Final Note

This is not just a widget.

It's a **foundation for building developer-facing visual APIs**.

If you extend it in interesting ways — consider contributing back.
