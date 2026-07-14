/**
 * One-shot codemod for the atomic-design restructure of src/components.
 *
 * Rewrites module specifiers so that every cross-directory import inside src/
 * uses the `@/` alias (shadcn convention, see tsconfig `paths`) with the new
 * atoms/molecules/organisms tier segment inserted. Run BEFORE moving the
 * component directories — the emitted alias paths already point at the future
 * locations, so the `git mv` step completes the migration.
 *
 * Rules:
 * - Imports that resolve inside the file's own component directory stay relative.
 * - The two barrels (src/index.ts, src/components/index.ts) keep relative
 *   specifiers; only the tier segment is inserted.
 * - Imports of `.storybook/*` (outside src, alias cannot cover) get one `../`
 *   prepended for files that will move one level deeper.
 * - Everything else under src/ becomes `@/<path-relative-to-src>` with the tier
 *   segment inserted for `components/<Name>/...` targets.
 *
 * Usage: node scripts/atomic-restructure-codemod.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DRY = process.argv.includes("--dry-run");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const COMPONENTS = path.join(SRC, "components");

const TIER_MAP = {
    // atoms
    Badge: "atoms", Button: "atoms", Checkbox: "atoms", FlexibleLayout: "atoms", Grid: "atoms",
    HoverToggler: "atoms", Icon: "atoms", Label: "atoms", Link: "atoms", NotAvailable: "atoms",
    ProgressBar: "atoms", RadioButton: "atoms", Separation: "atoms", Skeleton: "atoms", Spinner: "atoms",
    Sticky: "atoms", Structure: "atoms", Switch: "atoms", Tag: "atoms", TextField: "atoms",
    Tooltip: "atoms", Typography: "atoms",
    // molecules
    Accordion: "molecules", Breadcrumb: "molecules", Card: "molecules", ContentGroup: "molecules",
    ContextOverlay: "molecules", DataTable: "molecules", DecoupledOverlay: "molecules", Depiction: "molecules",
    Dialog: "molecules", FloatingCardStack: "molecules", Form: "molecules", Iframe: "molecules",
    InteractionGate: "molecules", LanguageCombobox: "molecules", List: "molecules", Menu: "molecules",
    Notification: "molecules", OverviewItem: "molecules", Pagination: "molecules", PropertyValuePair: "molecules",
    SaveStateIndicator: "molecules", Table: "molecules", Tabs: "molecules", TextReducer: "molecules",
    TokenInput: "molecules", Toolbar: "molecules", Tree: "molecules",
    // organisms
    AiElements: "organisms", Application: "organisms", AutocompleteField: "organisms", AutoSuggestion: "organisms",
    Chat: "organisms", CodeAutocompleteField: "organisms", ColorField: "organisms", MultiSelect: "organisms",
    MultiSuggestField: "organisms", Select: "organisms", SuggestField: "organisms", VisualTour: "organisms",
    Workspace: "organisms",
};

const SPEC_RE = /((?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\bjest\.mock\s*\(\s*|\brequire\s*\(\s*))"(\.[^"]+)"/g;

/** Insert the tier segment into a src-relative path like `components/Icon/Icon`. */
function withTier(relSrc) {
    const parts = relSrc.split("/");
    if (parts[0] === "components" && parts.length > 1 && TIER_MAP[parts[1]]) {
        parts.splice(1, 0, TIER_MAP[parts[1]]);
    }
    return parts.join("/");
}

function* walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(p);
        else if (/\.(ts|tsx)$/.test(e.name)) yield p;
    }
}

const files = [
    ...walk(COMPONENTS),
    ...walk(path.join(SRC, "cmem")),
    ...walk(path.join(SRC, "extensions")),
    path.join(SRC, "index.ts"),
];

/** The component dir (src/components/<Name>) a file belongs to, or null. */
function ownComponentDir(file) {
    const rel = path.relative(COMPONENTS, file);
    if (rel.startsWith("..")) return null;
    const name = rel.split(path.sep)[0];
    return TIER_MAP[name] ? path.join(COMPONENTS, name) : null;
}

let changed = 0, rewrites = 0;
for (const file of files) {
    const dir = path.dirname(file);
    const own = ownComponentDir(file);
    const isBarrel = file === path.join(SRC, "index.ts") || file === path.join(COMPONENTS, "index.ts");
    const src = fs.readFileSync(file, "utf8");
    const out = src.replace(SPEC_RE, (whole, prefix, spec) => {
        const target = path.resolve(dir, spec);
        // own-directory imports stay relative (they move together with the file)
        if (own && (target === own || target.startsWith(own + path.sep))) return whole;
        const relSrc = path.relative(SRC, target).split(path.sep).join("/");
        // outside src: repo-root index.ts -> "@/index"; .storybook/* -> depth fix; else untouched
        if (relSrc.startsWith("..")) {
            if (target === path.join(ROOT, "index")) return `${prefix}"@/index"`;
            if (target.startsWith(path.join(ROOT, ".storybook"))) {
                return own ? `${prefix}"../${spec}"` : whole;
            }
            return whole;
        }
        const tiered = withTier(relSrc);
        if (isBarrel) {
            // barrels do not move: keep the specifier relative, only insert the tier
            const relFromDir = path.relative(dir, path.join(SRC, tiered)).split(path.sep).join("/");
            const fixed = relFromDir.startsWith(".") ? relFromDir : `./${relFromDir}`;
            return fixed === spec ? whole : `${prefix}"${fixed}"`;
        }
        return `${prefix}"@/${tiered}"`;
    });
    if (out !== src) {
        changed++;
        const n = [...src.matchAll(SPEC_RE)].filter((m, i) => {
            const after = [...out.matchAll(SPEC_RE)][i];
            return !after || after[0] !== m[0];
        }).length;
        rewrites += n;
        if (DRY) {
            console.log(`--- ${path.relative(ROOT, file)} (${n} rewrites)`);
        } else {
            fs.writeFileSync(file, out);
        }
    }
}
console.log(`${DRY ? "[dry-run] " : ""}${changed} files changed, ~${rewrites} specifiers rewritten`);
