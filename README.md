<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06060B,50:2B2350,100:6C5CE7&height=170&section=header&text=DevPulse&fontSize=50&fontColor=F0F0F5&fontAlignY=40&desc=GitHub%20analytics%20in%20one%20static%20page&descAlignY=60&descSize=16" width="100%" alt="DevPulse" />

**Type a username. Get the shape of a developer in one screen.**

<br />

<a href="https://ankitavasudev.github.io/DevPulse/"><img src="https://img.shields.io/badge/%E2%96%B6%20LIVE%20DEMO-6C5CE7?style=for-the-badge&logoColor=white" alt="Live demo" /></a>
&nbsp;
<img src="https://img.shields.io/badge/dependencies-0-0D1117?style=for-the-badge" alt="Zero dependencies" />
&nbsp;
<img src="https://img.shields.io/badge/single%20file-56%20KB-0D1117?style=for-the-badge" alt="Single file" />
&nbsp;
<img src="https://img.shields.io/badge/tests-9%20passing-3FB950?style=for-the-badge" alt="Tests" />

</div>

---

## What it does

Enter any GitHub username and DevPulse fetches that profile, its repositories and its public events, then renders:

| Panel | What it shows |
| :-- | :-- |
| **Profile header** | Avatar, bio, company, location, blog, score badge |
| **Stat row** | Repos, followers, stars (summed across repos), forks, following |
| **Profile score** | 0–100 from six weighted components, each with its own bar so you can see where it comes from |
| **Streaks** | Longest consecutive active streak, active days, push events |
| **Public activity** | 90-day grid, intensity by events per day, with per-day tooltips |
| **Code frequency** | Commits per weekday, derived from push events |
| **Languages** | Share of repositories per language, colour-coded |
| **Top repositories** | Six most-starred repos with stars, forks and topics |
| **Timeline** | Recent public events, humanised |
| **Compare** | Two profiles side by side on the same metrics |
| **Notes** | Per-profile notes, saved in `localStorage`, exportable as Markdown |

Plus: dark/light theme, search history, JSON export, shareable `?user=` links, modals and toasts.

## Honest limits

DevPulse runs on GitHub's **unauthenticated** REST API, which imposes real constraints:

- **60 requests / hour per IP.** Each analysis costs 3 requests, so a class of students on one campus network can exhaust it. Comparison costs 5.
- **Public events only, 90 days, max 100 events.** The activity grid is therefore a *lower bound* on your contributions — private work, organisation work and older history are invisible. The UI says so under the card.
- **No contribution calendar.** GitHub's real contribution graph has no CORS-enabled public endpoint, so DevPulse never claims to show it.
- **The score is a heuristic, not a judgment.** It rewards repos, followers, stars, a filled bio, a location and recent activity. Anyone can game it; treat it as a dashboard, not a ranking.

The earlier version of this README showed a placeholder stock image as a "preview" and a table of self-awarded scores. Both are gone.

## How it works

```
username → /users/:user      → profile
          /users/:user/repos → language mix, stars, forks
          /users/:user/events/public → activity grid, streaks, weekday bars
```

No build step: `index.html` contains the markup, the CSS and the script. Open it and it runs.

## Run it

```bash
python -m http.server 8080     # or: npx serve .
# open http://localhost:8080/?user=torvalds
```

`file://` works for a plain open too, but `history.replaceState` (used for shareable links) behaves better over HTTP.

## Tests

```bash
npm test        # node --test, 9 tests
```

The suite guards the things that silently rot in a single-file app: that every `$('id')` the script looks up exists in the markup, that the inline script still parses, that no placeholder image sneaks back in, that every remote asset is HTTPS, and that the documented keyboard shortcuts are actually implemented.

## Keyboard

| Key | Action |
| :-- | :-- |
| `/` | Focus the search box |
| `Enter` | Analyze |
| `D` | Toggle theme |
| `S` | Copy the share link |
| `Esc` | Close the modal |

## Structure

```
DevPulse/
├── index.html      # the whole app (HTML + CSS + JS, ~56 KB)
├── tests/          # structural + syntax checks
├── README.md
└── LICENSE
```

## Stack

Vanilla JavaScript (no framework) · GitHub REST API v3 · CSS custom properties · `localStorage` · `node:test` · GitHub Actions · GitHub Pages

---

<div align="center">

**Ankita Salaria** · [@Ankitavasudev](https://github.com/Ankitavasudev)

</div>
