# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.



## Project Overview

This is the corporate marketing website for StoryCall (storycall.org), a service
that converts messages from SMS, Instagram, and other apps into scheduled phone
calls for people who don't use social media.

The site is a **static single-page HTML website** with no build process,
dependencies, or backend. It's hosted via GitHub Pages with a custom domain
(storycall.org).



## Architecture

- single_file_architecture: Everything (HTML, CSS, JavaScript) is in
                             `index.html`
- no_build_process: The site is served directly as-is
- deployment      : GitHub Pages (configured via CNAME file)
- main_app        : Separate application at app.storycall.org (not in
                             this repo)



## File Structure

- `index.html` - Complete website with inline CSS and JavaScript
- `CNAME` - Custom domain configuration for GitHub Pages
- `README.md` - Basic project description



## Rules on code and file layout



### wrapping (column ~80)

- wrap_at_80: Wrap prose at ~80 characters.
                             Do not reflow code blocks, fenced code, URLs, or
                             long literals. In labeled lists, keep wrap
                             alignment under the text after `: `.



### alignment (local, not global)

- align_local_neighborhood: Look a few lines up/down and align repeated
                             characters (typically `:` and `=`) when it
                             improves scan-ability.
- avoid_harmful_alignment: Skip alignment if it risks breaking parsing,
                             introduces fragile whitespace requirements,
                             or makes diffs confusing.
- css_blocks
  - rule_block: Prefer `property : value;` with colons aligned
                             inside that block.
  - root_family            : Align value columns for related variables (e.g.
                             opacity decimals, spacing sizes) so the
                             “numbers line up” visually.
  - keep_family            : Keep related vars together (e.g. `color_*`,
                             `opacity_*`, `space_*`, `radius_*`, `hero_*`).
- html
  - attribute_alignment: Optional; align only when it stays readable and
                             doesn’t create noisy diffs.
- js
  - assignment_alignment: Align assignment blocks (`=`) only when it stays
                             idiomatic and doesn’t fight formatting.



### naming (snake_case, user-meaningful roots)

- use_snake_case          : Use snake_case for things you can name (classes,
                            ids, vars, files, etc.).
- no_numbers: Avoid numbers for scalable tokens; use
                            small/medium/large etc. so names don’t become wrong
                             when values change.
- semantic_intensity      : Use semantic intensity terms for variants (e.g.
                            `strong/regular/subtle`, `soft/strong`,
                             `mobile`) instead of `_1/_2`.
- root_term_first: Choose the first term so sorted lists cluster
                            related concepts.
  - prefer_sub_terms: Favor adding a sub-term before creating a new root.
  - user_terms      : Use terms users understand, not programmer-only
                            jargon.
- prefix_cluster: Within a family, reuse the same left-side terms so
                            related names sit adjacent when sorted/
                             scanned (e.g. `color_background_*`,
                             `form_input_padding_*`).
- label_style: In `CLAUDE.md` label lists, use short snake_case
                            labels and align `:` locally.



### css literals → variables (when reasonable)

- reduce_hard_coded_numbers : Move repeated numbers into `:root` vars (0 and 1
                              literals are fine).
- opacity_vars: Avoid hard-coded alpha values; prefer `opacity_*`
                              vars.
- rgb_tuple_vars: Avoid repeating `255,255,255` / `0,0,0`; prefer
                              `color_rgb_*` vars.
- surfaces: `surface_*` should derive from `color_rgb_*` +
                              `opacity_*` (avoid redundant alias surfaces).
- breakpoints
  - prefer_rem         : Prefer `rem` for breakpoint values.
  - source_of_truth_var: Define a `breakpoint_*` var as the source of
                              truth, but keep a literal in `@media/@container`
                             conditions (and comment the var name) because
                             `var()` in conditions isn’t reliably supported
                             everywhere.



### doc/index.md (name_index) formatting rules

- keep_sorted              : Keep lexicographic order by name.
- blank_line_on_root_change: Insert a blank line when the root term changes
                             (first term before `_`).
- fixed_format : Use `name : type : detail`.
- align_columns: Align the first and second `:` columns vertically.
- short_type   : Keep `type` short and lowercase (examples: `css`,
                            `class`, `id`, `file`, `image`, `domain`,
                             `section`, `field`).
  - short_detail: Keep `detail` short, lowercase, and user-meaningful
                            (avoid “token”).
  - avoid_repeats: If `detail` just repeats the name words, replace it
                            with a short clarifier.



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

styling_approach: All CSS is inline in `<style>` tag with: 
- CSS custom properties for theming (colors, spacing, borders)
- Responsive design with media queries
- Subtle surface overlays and minimal color palette

no_backend : Contact form uses `mailto:` action to open user's email client
directly

java_script: Minimal vanilla JS for: 
- Dynamic copyright year
- Setting effective dates for Privacy/Terms sections



## Making Changes

When editing index.html: 
- Maintain the inline architecture (don't extract CSS/JS into separate files)
- Preserve accessibility attributes (aria-label, etc.)
- Keep the design system using CSS custom properties in `:root`
- Test responsive breakpoints (see `breakpoint_*` vars; note literals remain in
  `@media/@container`)



## Deployment

Changes to the `main` branch are automatically deployed to storycall.org via
GitHub Pages. No build or deployment commands needed.



## Contact

Support email: help@storycall.org
