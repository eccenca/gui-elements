/**
 * shadcn/ui primitives (style: radix-nova), vendored via the official shadcn CLI —
 * see `components.json`. The files in `ui/` are treated as vendored source:
 *
 *   • They are NOT reformatted by repo tooling. `ui/**` is excluded from prettier
 *     (`.prettierignore`), from eslint autofix (global `ignores` in `eslint.config.mjs`),
 *     and from the lint-staged autofix step. This keeps them byte-for-byte matched to CLI
 *     output so that real changes are visible instead of drowning in formatting noise.
 *   • They stay as close to pristine registry output as possible. A small set of
 *     intentional deviations from the CLI output is tracked in a drift allowlist — see
 *     `scripts/shadcn-drift-manifest.json` (the `allowlist` section carries a one-line
 *     reason per deviated file).
 *   • Their content is pinned by per-file SHA-256 hashes in that manifest and verified in
 *     CI by `yarn shadcn:drift`.
 *
 * Update procedure for a primitive (e.g. after an upstream registry change):
 *
 *     1. npx shadcn@latest add <name> --overwrite      # re-pull pristine CLI output
 *     2. yarn shadcn:drift                             # see which files drifted from the manifest
 *     3. re-apply the intentional deviations for that file (button/dropdown-menu/command/badge …),
 *        or consciously accept the new upstream output if a deviation is no longer needed
 *     4. yarn shadcn:drift:update                      # regenerate the manifest as the new baseline
 *
 * Do not hand-edit these files outside of that procedure — all eccenca customization lives in
 * the wrapper components under `src/components/`.
 *
 * These are internal foundations for gui-elements components. They are re-exported
 * from the root barrel under the `shadcn` namespace only:
 *
 *     import { shadcn } from "@eccenca/gui-elements";
 *     <shadcn.Button variant="outline" />
 *
 * There are no name collisions with public gui-elements exports because the namespace
 * keeps them apart (e.g. `Button` vs `shadcn.Button`).
 */
export * from "./ui/accordion";
export * from "./ui/alert";
export * from "./ui/alert-dialog";
export * from "./ui/aspect-ratio";
export * from "./ui/attachment";
export * from "./ui/avatar";
export * from "./ui/badge";
export * from "./ui/breadcrumb";
export * from "./ui/bubble";
export * from "./ui/button";
export * from "./ui/button-group";
export * from "./ui/calendar";
export * from "./ui/card";
export * from "./ui/carousel";
export * from "./ui/chart";
export * from "./ui/checkbox";
export * from "./ui/collapsible";
export * from "./ui/combobox";
export * from "./ui/command";
export * from "./ui/context-menu";
export * from "./ui/dialog";
export * from "./ui/direction";
export * from "./ui/drawer";
export * from "./ui/dropdown-menu";
export * from "./ui/empty";
export * from "./ui/field";
export * from "./ui/hover-card";
export * from "./ui/input";
export * from "./ui/input-group";
export * from "./ui/input-otp";
export * from "./ui/item";
export * from "./ui/kbd";
export * from "./ui/label";
export * from "./ui/marker";
export * from "./ui/menubar";
export * from "./ui/message";
export * from "./ui/message-scroller";
export * from "./ui/native-select";
export * from "./ui/navigation-menu";
export * from "./ui/pagination";
export * from "./ui/popover";
export * from "./ui/progress";
export * from "./ui/radio-group";
export * from "./ui/resizable";
export * from "./ui/scroll-area";
export * from "./ui/select";
export * from "./ui/separator";
export * from "./ui/sheet";
export * from "./ui/sidebar";
export * from "./ui/skeleton";
export * from "./ui/slider";
export * from "./ui/sonner";
export * from "./ui/spinner";
export * from "./ui/switch";
export * from "./ui/table";
export * from "./ui/tabs";
export * from "./ui/textarea";
export * from "./ui/toggle";
export * from "./ui/toggle-group";
export * from "./ui/tooltip";
