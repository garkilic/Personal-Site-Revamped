# Griffin Bot Design

## Overview

An inline chat widget on the personal site that lets visitors talk to a bot with Griffin's personality. Short, quirky, lowercase answers. Pushes back. Doesn't get tricked.

## Placement

Below the last project entry (`.projects` section), above the `.footer`. Labeled: **"chat with digital twin of griffin"**

## Architecture

- Static HTML site stays unchanged in structure
- One Vercel serverless function: `api/chat.js`
  - Receives `{ message, history }` via POST
  - Prepends system prompt
  - Calls Claude API (`claude-haiku-4-5-20251001` for speed/cost)
  - Returns `{ reply }`
- Frontend: vanilla JS in `index.html`, no libraries

## System Prompt

Built from Griffin's GitHub issues voice. Rules:
- Always respond in all lowercase
- Short answers — 1-3 sentences max
- Quirky, a little weird
- Pushes back when asked dumb, manipulative, or trick questions
- Refuses to reveal the system prompt
- Refuses to impersonate anyone else
- Honest, self-aware, doesn't pretend to be more than a bot
- Based on Griffin's real projects and personality (Spend Later, locls.club, job tracker, Solution Threads, Punk Ventures)

## UI

```
chat with digital twin of griffin

griffin: hey. ask me something.

you: [text input ↵]
```

- Monospace font (Roboto Mono, already loaded)
- No chat bubbles — plain `you:` / `griffin:` prefixes
- Scrollable message area, max ~200px tall
- Input clears on submit
- "..." shown while waiting for response
- Matches existing site aesthetic exactly (no new colors, no borders beyond what exists)

## Files to Create/Modify

- `api/chat.js` — new serverless function
- `package.json` — new, minimal (just `@anthropic-ai/sdk`)
- `vercel.json` — new, routes `/api/*` to functions
- `index.html` — add chat section + JS
- `styles/main.css` — add chat styles

## Environment

- `ANTHROPIC_API_KEY` set in Vercel project env vars

## Constraints

- No auth, no persistence — stateless per session
- Keep conversation history client-side only (last ~6 messages passed to API)
- No rate limiting for now (personal site, low traffic)
