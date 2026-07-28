# gui-elements re-platforming — what changed & why

Scope: the design-system rebuild of `@eccenca/gui-elements` on the `experimental/restyling`
branch (707 files, +33k/−17k lines). This is the library-scoped summary; the full cross-repo
record — including the complete decision log with verbatim quotes — lives in the DI
superproject on the same branch: `RESTYLING_CHANGES.md` and `RESTYLING_DECISIONS.md` at the
`data-integration` repo root. The `CHANGELOG.md` Unreleased section holds the itemized API
changes and migration notes.

## What changed

The underlying UI stack was swapped wholesale:

| Before                       | Now                                                |
| ---------------------------- | -------------------------------------------------- |
| Blueprint (`@blueprintjs/*`) | Radix primitives via vendored **shadcn/ui**        |
| Carbon components + icons    | shadcn components + **Lucide** icons               |
| SCSS/Sass pipeline           | **Tailwind CSS v4** + compiled `src/css/index.css` |
| `classnames`                 | `clsx` + `tailwind-merge` (`cn`) + cva             |

Structure: pristine CLI-owned `src/_shadcn/ui/` vendor layer (~64 primitives, `shadcn`
namespace) + public components re-sorted into `src/components/{atoms,molecules,organisms}`.
Tokens: OKLCH semantic sheet in `src/tailwind/theme.css` (light + dark), `ecc-*` palette ramps
from `src/configuration/colorPalette.ts`. Toolchain: React 19, SWC, husky 9, sass removed.
Public API largely preserved: component names/props mostly stable, semantic icon-name API
kept, every `eccgui-*` classname still emitted.

## Why — the decisions behind it

**The seed decision (2026-07-07).** The library looked and was built outdated; shadcn was the
target aesthetic. Crucially, the choice was _not_ to replace gui-elements with raw shadcn but
to **re-create the gui-elements component API on top of shadcn**, so consuming apps and
developers keep a familiar, easy component layer. That is why the props API and the
`eccgui-*` classnames are frozen contracts.

**Exhaustive conformance, not spot fixes.** A first, narrower restyling plan was rejected —
the mandate became enforcing the stock shadcn look across _every_ component ("simple
components that are common in dashboard applications"). This produced the 14px→16px rem-root
flip, the stock focus-ring recipe, the type scale, and the consistency canon: Lucide
everywhere at one size/stroke, `size-N` sizing, text-xs floor, rounded-rectangle badges (the
pre-existing de-facto majority; the shadcn pill default lost), no card-in-card, no grey table
headers, visible hover/cursor feedback, tooltips on icon-only buttons.

**SCSS died of root-cause analysis.** Leftover SCSS kept overriding the shadcn recipes;
instead of fighting specificity the whole layer was killed. The remainder was compiled
**mechanically** (dart-sass → one checked-in `src/css/index.css`, byte-diff verified) because
hand-rewriting legacy SCSS "is redesign work, not cleanup". That file is a frozen artifact:
new styling is written as Tailwind utilities only.

**Pristine vendor layer.** `src/_shadcn/ui` is regenerated with `shadcn add --all
--overwrite` and never hand-edited, so upgrading stays a single CLI command; all
customization lives in the wrappers, the theme sheet, or the app layer. This forced two
recorded choices: **React 19** for the whole stack (registry code uses ref-as-prop; a
forwardRef codemod was rejected) and vendoring the **full registry** (so any component is
available and one command syncs everything). A hash-manifest drift check guards the layer.

**Token architecture.**

- Brand orange (#f29100) lives in its own `--brand` token; `--primary` stays the eccenca
  accent blue. shadcn's `--accent` is deliberately **not** overridden — it is the pervasive
  hover-wash grey, and hijacking it for brand color would corrupt hover states everywhere.
- The `ecc-*` ramps exist because palette access should be Tailwind-idiomatic
  (`bg-ecc-orange-300`), not `var(--eccgui-…)` plumbing — an explicit user call, reversing a
  proposal to let the old palette die. Hue-based ramp names won over `ecc-primary/secondary`.
  Policy: semantic tokens for UI states/chrome, `ecc-*` only for categorical color.

**Library boundary.** gui-elements is the home for "state-of-the-art dashboard components":
generic components used by the apps get promoted _into_ the library (the AI-chat kit came in
under the distinct `AiElements` namespace to avoid colliding with the legacy Chat kit;
domain-bound pieces stay in the plugins). Consumers must not destructure raw `shadcn`
namespace primitives — when an app needs an unwrapped primitive, it gets promoted as a proper
component (as happened with `AlertDialog`).

**Quality gates.** Storybook was explicitly kept as the living documentation, with teeth:
every component dir must have a story, a smoke suite renders all stories (incl. `play`
functions and a dark-mode pass), and a token-contract test locks `theme.css`. SWC replaced
Babel because the build is pure tsc and the codebase is clean TS.

## Conventions for future work

- Never edit or import from `src/_shadcn/ui/`; regenerate via the shadcn CLI.
- New styling = Tailwind utilities; `src/css/index.css` is a frozen legacy artifact.
- Keep emitting `eccgui-*` classnames; don't rename public components (rename files instead).
- New generic components get stories, and palette/tokens changes must keep the contract tests
  green.
