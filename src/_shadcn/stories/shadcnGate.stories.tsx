import React from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Meta, StoryFn } from "@storybook/react";

import { SimpleDialog } from "../../components";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { Spinner } from "../ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Textarea } from "../ui/textarea";
import { Toggle } from "../ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

/**
 * Phase-0 gate stories for the vendored shadcn/ui primitives.
 *
 * 1. `ButtonWithTooltipAsChild` — a vendored shadcn Button used as `asChild` trigger of the
 *    vendored Tooltip. If the re-added `React.forwardRef` adaptations were broken, Radix could
 *    not anchor the tooltip to the button DOM node (React 18 has no ref-as-prop).
 * 2. `DropdownInsideSimpleDialog` — the mixed-overlay gate: a vendored (Radix) DropdownMenu
 *    rendered inside the EXISTING Blueprint-based gui-elements `SimpleDialog`.
 */
export default {
    title: "Experimental/shadcn Gate",
    component: Button,
} as Meta<typeof Button>;

const TemplateTooltip: StoryFn<typeof Button> = (args) => (
    <TooltipProvider>
        <div style={{ padding: "5rem" }}>
            <Tooltip defaultOpen>
                <TooltipTrigger asChild>
                    <Button {...args} />
                </TooltipTrigger>
                <TooltipContent>Tooltip anchored via forwardRef (asChild)</TooltipContent>
            </Tooltip>
        </div>
    </TooltipProvider>
);

export const ButtonWithTooltipAsChild = TemplateTooltip.bind({});
ButtonWithTooltipAsChild.args = {
    children: "shadcn Button (hover me)",
    variant: "default",
    size: "default",
};

const TemplateMixedOverlay: StoryFn<typeof SimpleDialog> = (args) => (
    <OverlaysProvider>
        <div style={{ height: "400px" }}>
            <SimpleDialog {...args}>
                <p>
                    This is the existing (Blueprint-based) <code>SimpleDialog</code>. The dropdown below is the vendored
                    shadcn/Radix <code>DropdownMenu</code> — the mixed-overlay stack gate.
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Open shadcn dropdown</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Radix menu in Blueprint dialog</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>First action</DropdownMenuItem>
                        <DropdownMenuItem>Second action</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">Destructive action</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SimpleDialog>
        </div>
    </OverlaysProvider>
);

export const DropdownInsideSimpleDialog = TemplateMixedOverlay.bind({});
DropdownInsideSimpleDialog.args = {
    title: "Mixed overlay gate",
    isOpen: true,
    usePortal: false,
    canEscapeKeyClose: true,
};

const TemplateResizable: StoryFn = () => (
    <div style={{ height: "240px" }}>
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel id="gate-left" defaultSize="33%" minSize="10%">
                <div className="flex h-full items-center justify-center bg-card p-2">left</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="gate-center" defaultSize="34%" minSize="10%">
                <div className="flex h-full items-center justify-center bg-muted p-2">center</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="gate-right" defaultSize="33%" minSize="10%">
                <div className="flex h-full items-center justify-center bg-card p-2">right</div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
);

export const ThreeColumnResizable = TemplateResizable.bind({});

/**
 * `MechanicalPrimitivesGallery` — a compact gallery of the wave-W1.1 vendored primitives
 * (select, textarea, input-group, toggle, toggle-group, collapsible, hover-card, table, spinner,
 * sheet, navigation-menu, button-group, breadcrumb). This is a mechanical-porting gate, not a
 * design review: the sheet only renders its trigger button (unopened).
 */
const TemplateMechanicalGallery: StoryFn = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "420px", padding: "2rem" }}>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Gallery</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <Select defaultValue="one">
            <SelectTrigger>
                <SelectValue placeholder="Choose one" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="one">One</SelectItem>
                <SelectItem value="two">Two</SelectItem>
            </SelectContent>
        </Select>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Alpha</TableCell>
                    <TableCell>1</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Beta</TableCell>
                    <TableCell>2</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Toggle aria-label="Toggle bold">Bold</Toggle>
            <ToggleGroup type="single" defaultValue="left">
                <ToggleGroupItem value="left">Left</ToggleGroupItem>
                <ToggleGroupItem value="center">Center</ToggleGroupItem>
            </ToggleGroup>
        </div>

        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="outline">Toggle details</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>Collapsible content revealed on toggle.</CollapsibleContent>
        </Collapsible>

        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link">Hover for info</Button>
            </HoverCardTrigger>
            <HoverCardContent>Hover card content.</HoverCardContent>
        </HoverCard>

        <Spinner />

        <Textarea placeholder="Type something…" />

        <InputGroup>
            <InputGroupInput placeholder="Search…" />
            <InputGroupAddon align="inline-end">
                <Spinner />
            </InputGroupAddon>
        </InputGroup>

        <ButtonGroup>
            <Button variant="outline">Left</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Right</Button>
        </ButtonGroup>

        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="#">Single item</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
        </Sheet>
    </div>
);

export const MechanicalPrimitivesGallery = TemplateMechanicalGallery.bind({});
