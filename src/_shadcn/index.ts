/**
 * Vendored shadcn/ui primitives (style: new-york-v4), adapted for this library
 * (React 18 `forwardRef`, per-primitive Radix packages, local `cn` util).
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
export * from "./ui/alert";
export * from "./ui/alert-dialog";
export * from "./ui/badge";
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/checkbox";
export * from "./ui/dialog";
export * from "./ui/dropdown-menu";
export * from "./ui/input";
export * from "./ui/label";
export * from "./ui/popover";
export * from "./ui/progress";
export * from "./ui/separator";
export * from "./ui/skeleton";
export * from "./ui/switch";
export * from "./ui/tabs";
export * from "./ui/tooltip";
