# temp.md

### alignment (local, not global)
- **align “like things” within a local neighborhood**: look a few lines up/down and align repeated characters (typically `:` and `=`) when it improves scan-ability.
- **don’t force alignment that harms code**: if alignment risks breaking parsing, introducing weird whitespace requirements, or making diffs confusing, skip it.
- **css blocks**
  - **within a rule block**: prefer `property : value;` with colons aligned inside that block.
  - **within `:root` families**: align *value columns* for related variables (e.g. opacity decimals, spacing sizes) so the “numbers line up” visually.
  - **keep families grouped**: keep related vars together (e.g. `color_*`, `opacity_*`, `space_*`, `radius_*`, `hero_*`).
- **html**
  - **attribute alignment is optional**: align only when it stays readable and doesn’t create noisy diffs.
- **js**
  - **align assignment blocks** (`=`) only when it stays idiomatic and doesn’t fight formatting.

### naming (snake_case, user-meaningful roots)
- **snake_case everywhere you can name things** (classes, ids, vars, files, etc.).
- **no numbers in names** for scalable tokens (use small/medium/large, etc.) so names don’t become wrong when values change.
- **root term first**: choose the first term so sorted lists cluster related concepts.
  - favor adding a sub-term before creating a new root.
  - use terms users understand (concepts), not programmer-only jargon.

### css literals → variables (when reasonable)
- **reduce hard-coded numbers**: move repeated or “design system” numbers into `:root` vars (0 and 1 literals are fine).
- **opacity**: avoid hard-coded alpha values; prefer `opacity_*` vars.
- **rgb tuples**: avoid repeating `255,255,255` / `0,0,0`; prefer `color_rgb_*` vars.
- **surfaces**: `surface_*` should derive from `opacity_surface_*` vars so it’s consistent.
- **breakpoints**
  - css vars are the “source of truth” (`breakpoint_*`), but keep literal values in `@media/@container` conditions (and comment the var name) because `var()` in conditions isn’t reliably supported everywhere.

### doc/index.md (name_index) formatting rules
- **keep it sorted** (lexicographic by name).
- **insert a blank line when the root term changes** (first term before `_`) so it’s scannable.
- **use two aligned colons per line**:
  - `name : type : detail`
  - align the first `:` column and the second `:` column vertically.
- **lowercase descriptions**.
- **avoid useless repetition**: if `detail` just repeats the name words, replace it with a short clarifier of what it refers to.

