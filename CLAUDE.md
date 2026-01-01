# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the corporate marketing website for StoryCall (storycall.org), a service that converts messages from Instagram, SMS, and other apps into scheduled phone calls for people who don't use social media.

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

rules about code aesthetics
1  across nearby lines in code files, align any characters that repeeat, such as = : " , [   


rules about names
1  name every file, directory, method, requirement, testcase, repository, commit, branch, etc that is conventionally ok to name
2  use snake_case, made up of terms
3  first term is root concept
4  term sequence is: root/main/big ...smaller/sub/attribute ...sometimes verb
5  make terms singular, not plural
6  use terms from existing names if it referring to the same concept
7  favor adding a new sub term before a new root
8  choose names so when sorted, related larger concepts on left align and break into smaller term on right
9  when processing every prompt, maintain doc/index.md file with sorted index of all used names
10 when processing every prompt, audit all newly used names and their place on index





## Sections in index.html

The single-page site contains these sections (accessible via anchor links):
- Header with navigation (sticky)
- Hero/main content area with CTA buttons
- `#how` - How it works (4-step process)
- `#help` - Help/contact form (mailto-based)
- `#faq` - Expandable FAQ items using `<details>`
- `#legal` - Full Privacy Policy and Terms & Conditions (expandable)
- `#about` - Company background
- Footer

## Key Design Patterns

**Styling approach**: All CSS is inline in `<style>` tag with:
- CSS custom properties for theming (colors, spacing, borders)
- Responsive design with media queries
- Gradient backgrounds and glassmorphic effects

**No backend**: Contact form uses `mailto:` action to open user's email client directly

**JavaScript**: Minimal vanilla JS for:
- Dynamic copyright year
- Setting effective dates for Privacy/Terms sections

## Making Changes

When editing index.html:
- Maintain the inline architecture (don't extract CSS/JS into separate files)
- Preserve accessibility attributes (aria-label, etc.)
- Keep the glassmorphic design system using CSS custom properties in `:root`
- Test responsive breakpoints (main breakpoint: 700px)

## Deployment

Changes to the `main` branch are automatically deployed to storycall.org via GitHub Pages. No build or deployment commands needed.

## Contact

Support email: paul@storycall.org
