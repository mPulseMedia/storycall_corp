# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the corporate marketing website for StoryCall (storycall.org), a service that converts messages from SMS, Instagram, and other apps into scheduled phone calls for people who don't use social media.

The site is a **static single-page HTML website** with no build process, dependencies, or backend. It's hosted via GitHub Pages with a custom domain (storycall.org).

## Architecture

- **Single-file architecture**: Everything (HTML, CSS, JavaScript) is in `index.html`
- **No build process**: The site is served directly as-is
- **Deployment**: GitHub Pages (configured via CNAME file)
- **Main app**: Separate application at app.storycall.org (not in this repo)

## File Structure

- `index.html` - Complete website with inline CSS and JavaScript
- `CNAME` - Custom domain configuration for GitHub Pages
- `README.md` - Basic project description

## Rules on code and file layout

### alignment (local, not global)

- **align “like things” within a local neighborhood**: look a few lines up/down and align repeated characters (typically `:` and `=`) when it improves scan-ability.
- **don’t force alignment that harms code**: if alignment risks breaking parsing, introducing weird whitespace requirements, or making diffs confusing, skip it.
- **definition colon target**: when aligning definitions, **aim to place the `:` at ~25 characters into the line**.
  - if any item in that neighborhood needs more room (longer name), **shift the `:` further right** for the whole neighborhood.
  - keep the `:` alignment local (don’t try to make one giant global column for the whole file).
- **css blocks**
  - **within a rule block**: align declaration `:` within that block using the **25-char target** rule above.
  - **within `:root` families**: align declaration `:` within a family, and (when helpful) align *value columns* for related variables (e.g. opacity decimals, spacing sizes) so the “numbers line up” visually.
  - **keep families grouped**: keep related vars together (e.g. `color_*`, `opacity_*`, `space_*`, `radius_*`, `hero_*`).
- **html**
  - **attribute alignment is optional**: align only when it stays readable and doesn’t create noisy diffs.
- **js**
  - **align assignment blocks** (`=`) only when it stays idiomatic and doesn’t fight formatting.

### naming (snake_case, user-meaningful roots)

- **snake_case everywhere you can name things** (classes, ids, vars, files, etc.).
- **no numbers in names** for scalable tokens (use small/medium/large, etc.) so names don’t become wrong when values change.
- **use semantic intensity terms** when you need variants (e.g. `strong/regular/subtle`, `soft/strong`, `mobile`) instead of numeric suffixes like `_1/_2`.
- **root term first**: choose the first term so sorted lists cluster related concepts.
  - favor adding a sub-term before creating a new root.
  - use terms users understand (concepts), not programmer-only jargon.
- **prefix-cluster within a family**: for vars that are meant to “go together”, reuse the same left-side terms so they sit adjacent when sorted/scanned (e.g. `color_bg_*`, `form_input_padding_*`).

### css literals → variables (when reasonable)

- **reduce hard-coded numbers**: move repeated or “design system” numbers into `:root` vars (0 and 1 literals are fine).
- **opacity**: avoid hard-coded alpha values; prefer `opacity_*` vars.
- **rgb tuples**: avoid repeating `255,255,255` / `0,0,0`; prefer `color_rgb_*` vars.
- **background**: `background_*` should derive from `color_rgb_*` + `opacity_*` (avoid redundant alias backgrounds).
- **breakpoints**
  - prefer **rem** for breakpoint values.
  - define a `breakpoint_*` var as the source of truth, but keep a literal in `@media/@container` conditions (and comment the var name) because `var()` in conditions isn’t reliably supported everywhere.

### doc/index.md (name_index) formatting rules

- **keep it sorted** (lexicographic by name).
- **insert a blank line when the root term changes** (first term before `_`) so it’s scannable.
- **format is always**: `name : type : detail`
  - align the first `:` column (use the **25-char target** rule), and align the second `:` column within the same neighborhood.
  - keep `type` short and lowercase (examples: `css`, `class`, `id`, `file`, `image`, `domain`, `section`, `field`).
  - keep `detail` short, lowercase, and user-meaningful (avoid the word “token”).
  - if `detail` just repeats the name words, replace it with a short clarifier of what it refers to.

## Sections in index.html

The single-page site contains these sections (accessible via anchor links):
- Header with navigation (sticky)
- Hero/main content area with CTA buttons
- `#how` - How it works (3-step process)
- `#help` - Help/contact form (mailto-based)
- `#faq` - Expandable FAQ items using `<details>`
- `#legal` - Full Privacy Policy and Terms & Conditions (expandable)
- `#about` - Company background
- Footer

## Key Design Patterns

**Styling approach**: All CSS is inline in `<style>` tag with:
- CSS custom properties for theming (colors, spacing, borders)
- Responsive design with media queries
- Subtle surface overlays and minimal color palette

**No backend**: Contact form uses `mailto:` action to open user's email client directly

**JavaScript**: Minimal vanilla JS for:
- Dynamic copyright year
- Setting effective dates for Privacy/Terms sections

## Making Changes

When editing index.html:
- Maintain the inline architecture (don't extract CSS/JS into separate files)
- Preserve accessibility attributes (aria-label, etc.)
- Keep the design system using CSS custom properties in `:root`
- Test responsive breakpoints (see `breakpoint_*` vars; note literals remain in `@media/@container`)

## Deployment

Changes to the `main` branch are automatically deployed to storycall.org via GitHub Pages. No build or deployment commands needed.

## Contact

Support email: help@storycall.org
