# Dark Mode — Design Spec

Date: 2026-05-18
Status: Approved

## Goal

Add a dark mode to the personal site that activates automatically based on the
visitor's OS/browser appearance setting. No toggle, no JS, no persisted state.
Light mode must remain visually identical to today.

## Scope

- **In scope:** `styles/main.css` only.
- **Out of scope:** `index.html`, `js/`, any JS, any UI control, light-mode appearance changes.

## Activation

`@media (prefers-color-scheme: dark)`. Visitors with system dark mode see the
dark palette; everyone else sees the unchanged light site. No manual override.

## Approach

CSS custom properties. Lift the hardcoded colors into `:root` variables,
reference them via `var(--…)` throughout the stylesheet, then override the
variable values inside a single `@media (prefers-color-scheme: dark)` block.

Rationale: the stylesheet is small (~221 lines) and clean; variables make the
dark palette a single-block edit and prevent the two-copies-drift problem of
duplicating selectors.

## Color Tokens

| Token           | Light (current)         | Dark        | Used by                                            |
|-----------------|-------------------------|-------------|----------------------------------------------------|
| `--bg`          | `#ffffff`               | `#0a0a0a`   | `body` background                                  |
| `--accent`      | `#1d4ed8`               | `#5b8def`   | name, project/bside links, chat title, chat text, input, submit |
| `--accent-link` | `#3b82f6`               | `#6b9aef`   | footer links/buttons                               |
| `--muted`       | `#6b7280`               | `#9aa3b2`   | tagline, location, footer, chat speaker, chat subtitle |
| `--faint`       | `#9ca3af`               | `#6b7280`   | bside-label, placeholders                          |
| `--border`      | `#e5e7eb`               | `#2a2a2a`   | chat box border, chat-header border                |
| `--border-input`| `#d1d5db`               | `#3a3a3a`   | chat input underline (unfocused)                   |

`#1d4ed8` focus-state underline on `.chat-input:focus` follows `--accent`.

## Changes to `styles/main.css`

1. Add a `:root { … }` block at the top defining the seven tokens at their
   current light values.
2. Replace each literal color in the ~20 color-bearing declarations with the
   matching `var(--…)`.
3. Append one `@media (prefers-color-scheme: dark) { :root { … } }` block that
   redefines the seven tokens with their dark values.

No selector structure, layout, spacing, font, or media-query (the existing
`max-width: 600px` block) changes.

## Accessibility

Dark accent `#5b8def` on `#0a0a0a` ≈ 5.9:1 contrast — passes WCAG AA for normal
text. Muted `#9aa3b2` on `#0a0a0a` ≈ 7:1. Faint `#6b7280` is used only for
non-essential decorative text (labels, placeholders).

## Verification

No test runner exists (static site). Manual verification:

1. Open `index.html` in a browser.
2. With OS in light mode: confirm the site is pixel-identical to current.
3. Switch OS to dark mode: confirm dark palette applies, all text readable.
4. Check the `max-width: 600px` mobile breakpoint in both modes.
5. Check chat states in dark mode: empty, with messages, input focused,
   submit hover, placeholder text.

## Risks

- Low. Single-file CSS change, no logic. Main risk is missing a hardcoded
  color during the var replacement — caught by the dark-mode eyeball pass
  (any unconverted color stays light and will visibly stand out on `#0a0a0a`).
