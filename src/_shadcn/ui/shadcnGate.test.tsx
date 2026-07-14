/**
 * Gate test: ref attachment for the CLI-managed shadcn/ui primitives (pristine "radix-nova"
 * registry output, React 19 ref-as-prop). Each `it` mounts the primitive's root/trigger and
 * asserts the passed ref resolves to a real DOM node — this guards wrapper components and
 * Radix `asChild` composition, which both rely on refs reaching the underlying element.
 */
import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Alert, AlertTitle } from "./alert";
import { AlertDialog, AlertDialogTrigger } from "./alert-dialog";
import { Attachment, AttachmentContent, AttachmentTitle, AttachmentTrigger } from "./attachment";
import { Badge } from "./badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "./breadcrumb";
import { Bubble, BubbleContent } from "./bubble";
import { Button } from "./button";
import { ButtonGroup, ButtonGroupText } from "./button-group";
import { Card } from "./card";
import { Checkbox } from "./checkbox";
import { Collapsible, CollapsibleTrigger } from "./collapsible";
import { Dialog, DialogTrigger } from "./dialog";
import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";
import { HoverCard, HoverCardTrigger } from "./hover-card";
import { Input } from "./input";
import { InputGroup, InputGroupInput } from "./input-group";
import { Label } from "./label";
import { Marker, MarkerContent } from "./marker";
import { Message, MessageContent } from "./message";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu";
import { Popover, PopoverTrigger } from "./popover";
import { Progress } from "./progress";
import { ResizablePanel, ResizablePanelGroup } from "./resizable";
import { Select, SelectTrigger, SelectValue } from "./select";
import { Separator } from "./separator";
import { Sheet, SheetTrigger } from "./sheet";
import { Sidebar, SidebarMenuButton, SidebarProvider } from "./sidebar";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { Switch } from "./switch";
import { Table } from "./table";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Textarea } from "./textarea";
import { Toggle } from "./toggle";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./tooltip";

describe("shadcn gate: React 18 ref forwarding", () => {
    it("select forwards a ref to the trigger button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Select>
                <SelectTrigger ref={ref}>
                    <SelectValue placeholder="Pick" />
                </SelectTrigger>
            </Select>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("textarea forwards a ref to the textarea element", () => {
        const ref = React.createRef<HTMLTextAreaElement>();
        render(<Textarea ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("input-group forwards a ref to the input control", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(
            <InputGroup>
                <InputGroupInput ref={ref} />
            </InputGroup>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("toggle forwards a ref to the toggle button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Toggle ref={ref}>Bold</Toggle>);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("toggle-group forwards a ref to the group root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ToggleGroup type="single" ref={ref}>
                <ToggleGroupItem value="a">A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("collapsible forwards a ref to the trigger", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Collapsible>
                <CollapsibleTrigger ref={ref}>Toggle</CollapsibleTrigger>
            </Collapsible>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("hover-card forwards a ref to the trigger", () => {
        const ref = React.createRef<HTMLAnchorElement>();
        render(
            <HoverCard>
                <HoverCardTrigger ref={ref}>Hover me</HoverCardTrigger>
            </HoverCard>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("table forwards a ref to the table element", () => {
        const ref = React.createRef<HTMLTableElement>();
        render(<Table ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spinner forwards a ref to the svg element", () => {
        const ref = React.createRef<SVGSVGElement>();
        render(<Spinner ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });

    it("sheet forwards a ref to the trigger button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Sheet>
                <SheetTrigger ref={ref}>Open</SheetTrigger>
            </Sheet>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("sidebar forwards a ref to the menu button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <SidebarProvider>
                <Sidebar collapsible="none">
                    <SidebarMenuButton ref={ref}>Item</SidebarMenuButton>
                </Sidebar>
            </SidebarProvider>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("navigation-menu forwards a ref to the nav root", () => {
        const ref = React.createRef<HTMLElement>();
        render(
            <NavigationMenu ref={ref} viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("button-group forwards a ref to the group root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ButtonGroup ref={ref}>
                <ButtonGroupText>Label</ButtonGroupText>
            </ButtonGroup>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("breadcrumb forwards a ref to the nav element", () => {
        const ref = React.createRef<HTMLElement>();
        render(
            <Breadcrumb ref={ref}>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("resizable renders the panel group root", () => {
        // react-resizable-panels reserves the Group ref for its imperative API (not the DOM
        // node), so this gate asserts on the rendered root element instead.
        const { container } = render(
            <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel id="gate-a" defaultSize="50%">
                    a
                </ResizablePanel>
                <ResizablePanel id="gate-b" defaultSize="50%">
                    b
                </ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(container.querySelector('[data-slot="resizable-panel-group"]')).toBeInstanceOf(HTMLElement);
    });

    // Coverage extension: the primitives below were vendored earlier but had no gate entry;
    // the asChild-anchoring triggers (dialog, popover, dropdown, tooltip, tabs) are the ones
    // that break silently under React 18 without forwardRef.
    it("button forwards a ref to the button element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Go</Button>);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("badge forwards a ref to the span element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Badge ref={ref}>New</Badge>);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("alert forwards a ref to the alert root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Alert ref={ref}>
                <AlertTitle>Heads up</AlertTitle>
            </Alert>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("alert-dialog forwards a ref to the trigger button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <AlertDialog>
                <AlertDialogTrigger ref={ref}>Open</AlertDialogTrigger>
            </AlertDialog>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("card forwards a ref to the card root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Card ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("checkbox forwards a ref to the checkbox button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Checkbox ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("dialog forwards a ref to the trigger button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Dialog>
                <DialogTrigger ref={ref}>Open</DialogTrigger>
            </Dialog>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("dropdown-menu forwards a ref to the trigger button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger ref={ref}>Open</DropdownMenuTrigger>
            </DropdownMenu>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("input forwards a ref to the input element", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("label forwards a ref to the label element", () => {
        const ref = React.createRef<HTMLLabelElement>();
        render(<Label ref={ref}>Name</Label>);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("popover forwards a ref to the trigger button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Popover>
                <PopoverTrigger ref={ref}>Open</PopoverTrigger>
            </Popover>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("progress forwards a ref to the progress root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Progress ref={ref} value={40} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("separator forwards a ref to the separator element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Separator ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("skeleton forwards a ref to the skeleton element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Skeleton ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("switch forwards a ref to the switch button", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Switch ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("tabs forwards a ref to the tab trigger", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Tabs defaultValue="a">
                <TabsList>
                    <TabsTrigger value="a" ref={ref}>
                        A
                    </TabsTrigger>
                </TabsList>
            </Tabs>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("tooltip forwards a ref to the trigger", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger ref={ref}>Hover</TooltipTrigger>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });
});

describe("shadcn gate: June 2026 chat primitives", () => {
    it("message forwards a ref and renders content", () => {
        const ref = React.createRef<HTMLDivElement>();
        const { getByText } = render(
            <Message ref={ref} align="end">
                <MessageContent>hello</MessageContent>
            </Message>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
        expect(ref.current).toHaveAttribute("data-align", "end");
        expect(getByText("hello")).toBeInTheDocument();
    });

    it("bubble forwards a ref and applies the variant data attribute", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Bubble ref={ref} variant="muted">
                <BubbleContent>hi</BubbleContent>
            </Bubble>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
        expect(ref.current).toHaveAttribute("data-variant", "muted");
    });

    it("attachment forwards refs on root and trigger", () => {
        const rootRef = React.createRef<HTMLDivElement>();
        const triggerRef = React.createRef<HTMLButtonElement>();
        render(
            <Attachment ref={rootRef} state="uploading">
                <AttachmentContent>
                    <AttachmentTitle>report.pdf</AttachmentTitle>
                </AttachmentContent>
                <AttachmentTrigger ref={triggerRef} aria-label="Open report.pdf" />
            </Attachment>,
        );
        expect(rootRef.current).toBeInstanceOf(HTMLElement);
        expect(rootRef.current).toHaveAttribute("data-state", "uploading");
        expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("marker forwards a ref and renders the separator variant", () => {
        const ref = React.createRef<HTMLDivElement>();
        const { getByText } = render(
            <Marker ref={ref} variant="separator">
                <MarkerContent>Today</MarkerContent>
            </Marker>,
        );
        expect(ref.current).toBeInstanceOf(HTMLElement);
        expect(ref.current).toHaveAttribute("data-variant", "separator");
        expect(getByText("Today")).toBeInTheDocument();
    });
});
