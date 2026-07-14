/**
 * shadcn/ui primitives (style: radix-nova), managed by the official shadcn CLI —
 * see `components.json`. The files in `ui/` are pristine registry output; sync them
 * with `npx shadcn@latest add --all --overwrite`. Do not edit them by hand: all
 * eccenca customization lives in the wrapper components under `src/components/`.
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
