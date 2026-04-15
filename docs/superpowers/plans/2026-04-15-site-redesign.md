# Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current multi-page, dynamic site with a single fully static HTML page — white background, blue monospace text, two featured projects, clipboard email copy.

**Architecture:** One `index.html` + one `styles/main.css`. No JavaScript libraries, no separate pages, no dynamic content. The only JS is a two-line inline clipboard function for the email link. Everything else is deleted.

**Tech Stack:** Vanilla HTML, CSS, one inline `<script>` tag. Roboto Mono from Google Fonts.

---

## File Map

| Action | Path |
|--------|------|
| Rewrite | `index.html` |
| Rewrite | `styles/main.css` |
| Delete | `Pages/projects.html` |
| Delete | `Pages/prototypes.html` |
| Delete | `Pages/pdoom.html` |
| Delete | `js/typing.js` |
| Delete | `js/github-api.js` |
| Delete | `js/config.js` |
| Delete | `styles/prototypes.css` |
| Delete | `styles/blog.css` |
| Delete | `styles/typing.css` |
| Delete | `styles/components/` (entire directory) |

---

### Task 1: Delete old files

**Files:**
- Delete: `Pages/projects.html`, `Pages/prototypes.html`, `Pages/pdoom.html`
- Delete: `js/typing.js`, `js/github-api.js`, `js/config.js`
- Delete: `styles/prototypes.css`, `styles/blog.css`, `styles/typing.css`, `styles/components/`

- [ ] **Step 1: Remove old pages and JS**

```bash
rm Pages/projects.html Pages/prototypes.html Pages/pdoom.html
rm js/typing.js js/github-api.js js/config.js
```

- [ ] **Step 2: Remove old CSS files**

```bash
rm styles/prototypes.css styles/blog.css styles/typing.css
rm -rf styles/components
```

- [ ] **Step 3: Verify deletions**

```bash
ls Pages/ js/ styles/
```

Expected: `Pages/` is empty (or gone), `js/` is empty (or gone), `styles/` contains only `main.css` (which we'll overwrite next).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Remove old pages, JS, and CSS files"
```

---

### Task 2: Write new CSS

**Files:**
- Modify: `styles/main.css` (full rewrite)

- [ ] **Step 1: Write `styles/main.css`**

Replace the entire file with:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #ffffff;
  color: #1d4ed8;
  font-family: 'Roboto Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 64px 32px 80px;
}

.container {
  max-width: 560px;
}

.name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.tagline,
.location {
  color: #6b7280;
  font-size: 13px;
}

.tagline {
  margin-bottom: 2px;
}

.location {
  margin-bottom: 36px;
}

.projects {
  margin-bottom: 48px;
}

.project {
  margin-bottom: 10px;
  font-size: 13px;
}

.project a {
  color: #1d4ed8;
  text-decoration: none;
}

.project a:hover {
  text-decoration: underline;
}

.footer {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 20px;
}

.footer a,
.footer button {
  color: #3b82f6;
  text-decoration: none;
  background: none;
  border: none;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.footer a:hover,
.footer button:hover {
  text-decoration: underline;
}
```

- [ ] **Step 2: Commit**

```bash
git add styles/main.css
git commit -m "Write new minimal CSS"
```

---

### Task 3: Rewrite index.html

**Files:**
- Modify: `index.html` (full rewrite)

- [ ] **Step 1: Write `index.html`**

Replace the entire file with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>griffin arkilic</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <div class="container">

    <div class="name">griffin arkilic</div>
    <div class="tagline">building things</div>
    <div class="location">los angeles, ca</div>

    <div class="projects">
      <div class="project">
        <a href="https://www.solutionthreads.com" target="_blank" rel="noopener">
          solution threads ↗
        </a>
        — custom ai workflows that let a team of 5 operate like a team of 50
      </div>
      <div class="project">
        <a href="https://apps.apple.com/us/app/spend-later/id6753609229" target="_blank" rel="noopener">
          spend later ↗
        </a>
        — ios deferred spending app
      </div>
    </div>

    <div class="footer">
      <a href="https://github.com/garkilic" target="_blank" rel="noopener">github</a>
      <button onclick="copyEmail()" id="email-btn">email</button>
      <a href="/Files/Resume.pdf" target="_blank">resume</a>
    </div>

  </div>

  <script>
    function copyEmail() {
      navigator.clipboard.writeText('garkilic@gmail.com');
      const btn = document.getElementById('email-btn');
      btn.textContent = 'copied!';
      setTimeout(() => { btn.textContent = 'email'; }, 2000);
    }
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify the resume PDF path**

```bash
ls Files/
```

Expected: a PDF file. Note the exact filename and update the `href` in `index.html` if it differs from `Resume.pdf`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rewrite index.html — single page, minimal, static"
```

---

### Task 4: Verify in browser

- [ ] **Step 1: Open the site locally**

Open `index.html` directly in a browser (drag file into browser, or run `open index.html` on macOS).

- [ ] **Step 2: Check the following**

  - White background, blue text, monospace font loads correctly
  - "griffin arkilic" name at top
  - "building things" and "los angeles, ca" in gray below
  - Two project lines with working `↗` links (open in new tab)
  - Footer has github, email, resume links
  - Click "email" — text changes to "copied!" for 2 seconds, then reverts
  - Paste into any text field — should paste `garkilic@gmail.com`
  - Click "resume" — opens PDF

- [ ] **Step 3: Check resume filename**

If the resume link gives a 404, find the correct filename:

```bash
ls Files/
```

Update the `href` in `index.html` to match the exact filename.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add index.html
git commit -m "Fix resume path"
```
