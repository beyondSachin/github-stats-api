# 🚀 GitHub Stats API

A fast, customizable, and developer-friendly **TypeScript API** that generates dynamic SVG GitHub stats — designed for reliability, extensibility, and clean architecture.

> Built for developers who want control — not dependency on fragile third-party deployments.

---

## 🌍 Why this exists

Most GitHub stats services:

- break due to rate limits
- depend on shared infrastructure
- lack extensibility

This project solves that by giving you:

- full ownership
- predictable performance
- a clean foundation to extend

---

## ✨ Features

- 📊 **Rich GitHub Metrics**
  - Repositories, Stars, Forks
  - Followers / Following
  - Public Gists
  - Most Starred Repository
  - Joined Year

- 🎨 **Theme System**
  - Built-in themes: `github` (default), `ocean`, `forest`, `sunset`, `dracula`
  - Fully overrideable via query params

- 🧩 **Composable Design**
  - Separate layers: `data → aggregation → rendering`
  - Easy to extend (add metrics, layouts, themes)

- 📐 **Flexible Layouts**
  - `default` (detailed card)
  - `compact` (minimal footprint)

- ⚡ **Modern Stack**
  - TypeScript
  - Native Fetch API (no axios)
  - Node.js 18+ / Edge-compatible

- 🧠 **Production-minded**
  - Cache headers included
  - Token-based GitHub API access
  - Designed for serverless deployment

---

## 🧱 Architecture

```text
Request → GitHub API → Stats Engine → SVG Renderer → Response
```

| Layer       | Responsibility       |
| ----------- | -------------------- |
| `github.ts` | Fetch GitHub data    |
| `stats.ts`  | Aggregate & compute  |
| `svg.ts`    | Render visual output |
| `server.ts` | API interface        |

---

## 🎨 Customization

### Themes

```bash
?theme=dracula
```

Available:

- `github` (default theme)
- `ocean`
- `forest`
- `sunset`
- `dracula`

---

### Layouts

```bash
?layout=compact
```

| Layout    | Description                |
| --------- | -------------------------- |
| `default` | Full stats + featured repo |
| `compact` | Minimal summary            |

---

### Custom Colors

Override any theme:

```bash
?bg=0d1117&title=58a6ff&text=c9d1d9
```

| Param    | Purpose        |
| -------- | -------------- |
| `bg`     | Background     |
| `border` | Card border    |
| `title`  | Heading        |
| `text`   | Main text      |
| `accent` | Secondary text |
| `card`   | Highlight card |

---

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/sachinksamad1/github-stats-api.git
cd github-stats-api
```

---

### 2. Install

```bash
npm install
```

---

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

---

### 5. Run

```bash
npm run dev
```

Test:

```bash
http://localhost:3000/api?username=your-username
```

---

## ☁️ Deployment

### Vercel (Recommended)

1. Fork repo
2. Import into Vercel
3. Add env variable:

   ```
   GITHUB_TOKEN=your_token
   ```

4. Deploy

---

## 🖼️ Usage in README

```markdown
![GitHub Stats](https://your-app.vercel.app/api?username=your-username)
```

---

## 🧪 Example Variants

```markdown
# Theme

![Stats](...&theme=dracula)

# Compact

![Stats](...&layout=compact)

# Custom

![Stats](...&bg=0d1117&title=58a6ff)
```

---

## 🧩 Extending the Project

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

---

### Add new theme

Edit:

```text
src/themes.ts (create if needed)
```

---

### Add new layout

Edit:

```text
src/svg.ts
```

---

## 🤝 Contributing

Contributions are welcome — especially thoughtful ones.

### Before submitting PR

- Keep functions pure where possible
- Maintain separation of concerns
- Avoid unnecessary dependencies
- Prefer native APIs (e.g., `fetch`)

---

### Development Workflow

```bash
git checkout -b feat/your-feature
npm run dev
npm run format # Format files with Prettier
npm run lint   # Lint files with ESLint
```

---

### Commit Convention

```text
feat: add language weighting
fix: handle null repo language
refactor: split svg renderer
```

---

## ⚠️ Limitations

- GitHub REST API limited to 100 repos/page
- Rate limits without token (~60/hr)
- No historical contribution data (without GraphQL)

---

## 🛡️ Best Practices

- Always use a `GITHUB_TOKEN`
- Enable caching (already configured)
- Self-host for reliability

---

## 📜 License

MIT — use it, modify it, build on top of it.

---

## ⭐ Final Note

This is not just a widget.

It’s a **foundation for building developer-facing visual APIs**.

If you extend it in interesting ways — consider contributing back.
