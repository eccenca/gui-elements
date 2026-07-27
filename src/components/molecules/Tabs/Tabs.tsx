import React from "react";

import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from "@/_shadcn/ui/tabs";
import { cn } from "@/common/utils/cn";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { TabId, TabProps, transformTabProperties } from "./Tab";

export interface TabsProps extends TestableComponent {
    children?: React.ReactNode;
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * Unique identifier for this `Tabs` container.
     */
    id: TabId;
    /**
     * Data structure containing all tabs, including their titles and content panels.
     * Currently it is not possible to add `Tab` elements direct as children elements to the `<Tabs>` container.
     */
    tabs?: TabProps[];
    /**
     * Initial selected tab `id`, for uncontrolled usage.
     */
    defaultSelectedTabId?: TabId;
    /**
     * Selected tab `id`, for controlled usage.
     * Providing this prop will put the component in controlled mode.
     */
    selectedTabId?: TabId;
    /**
     * Whether inactive tab panels should be removed from the DOM and unmounted in React.
     * This can improve performance when panels are heavy.
     *
     * @default false
     */
    renderActiveTabPanelOnly?: boolean;
    /**
     * Whether the tabs list should fill the width of its parent.
     */
    fill?: boolean;
    /**
     * A callback function that is invoked when a tab in the tab list is clicked.
     * Declared as a method signature (bivariant) to keep the historical BlueprintJS assignability.
     */
    onChange?(newTabId: TabId, prevTabId: TabId | undefined, event: React.MouseEvent<HTMLElement>): void;
    /**
     * Allow scrollbars on the tabs header.
     * Otherwise they will be shrinked if not enough space.
     */
    allowScrollbars?: boolean;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Tabs = ({
    tabs = [],
    children,
    className = "",
    id,
    selectedTabId,
    defaultSelectedTabId,
    renderActiveTabPanelOnly = false,
    fill,
    onChange,
    allowScrollbars,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    wrapperProps,
}: TabsProps) => {
    const hasTabs = tabs.length > 0;

    // Radix works with string values only; keep a lookup so the original `TabId` (which may be a
    // number) can be handed back to `onChange` unchanged.
    const idByStringValue = React.useMemo(() => {
        const map = new Map<string, TabId>();
        tabs.forEach((tab) => map.set(String(tab.id), tab.id));
        return map;
    }, [tabs]);

    // Tracks the currently selected id for uncontrolled usage so we can provide `prevTabId`.
    const currentIdRef = React.useRef<TabId | undefined>(defaultSelectedTabId ?? tabs[0]?.id);
    // Capture of the DOM event that triggered the selection change (Radix's `onValueChange` does
    // not expose it) so we can preserve the `(newTabId, prevTabId, event)` signature. Radix activates
    // a tab on `mousedown` (pointer) and on `keydown` (keyboard); we record both in the capture phase,
    // before Radix runs.
    const lastEventRef = React.useRef<React.SyntheticEvent | undefined>(undefined);
    const captureEvent = React.useCallback((event: React.SyntheticEvent) => {
        lastEventRef.current = event;
    }, []);
    // Pointer selections are activated by Radix on `mousedown`, but the gesture the user perceives
    // (and the event we want to hand to `onChange`) is the trailing `click`. Buffer the change here
    // when it originates from a pointer press and flush it once the `click` arrives.
    const pendingChangeRef = React.useRef<{ newTabId: TabId; prevTabId: TabId | undefined } | null>(null);

    const isControlled = selectedTabId != null;

    const handleValueChange = (value: string) => {
        const newTabId = idByStringValue.get(value) ?? value;
        const prevTabId = isControlled ? selectedTabId : currentIdRef.current;
        if (!isControlled) {
            currentIdRef.current = newTabId;
        }
        const activatingEvent = lastEventRef.current;
        if (activatingEvent?.type === "mousedown") {
            // Defer to the trailing `click` so `onChange` receives the pointer event that actually
            // completed the selection instead of the internal `mousedown`.
            pendingChangeRef.current = { newTabId, prevTabId };
        } else {
            // Keyboard (or programmatic) activation: hand over the real activating event immediately.
            onChange?.(newTabId, prevTabId, activatingEvent as unknown as React.MouseEvent<HTMLElement>);
        }
    };

    const flushPendingChange = (event: React.SyntheticEvent) => {
        const pending = pendingChangeRef.current;
        if (!pending) {
            return;
        }
        pendingChangeRef.current = null;
        onChange?.(pending.newTabId, pending.prevTabId, event as unknown as React.MouseEvent<HTMLElement>);
    };

    const controlledValue = isControlled ? String(selectedTabId) : undefined;
    const uncontrolledDefaultValue = isControlled ? undefined : String(defaultSelectedTabId ?? tabs[0]?.id ?? "");

    const tabsContent = (
        <TabsRoot
            id={id != null ? String(id) : undefined}
            value={controlledValue}
            defaultValue={uncontrolledDefaultValue}
            onValueChange={handleValueChange}
            onMouseDownCapture={captureEvent}
            onKeyDownCapture={captureEvent}
            onClick={flushPendingChange}
            className={cn(`${eccgui}-tabs`, allowScrollbars && `${eccgui}-tabs--scrollablelist`, className)}
        >
            {hasTabs ? (
                <>
                    <TabsList
                        variant="line"
                        className={cn(
                            `${eccgui}-tabs__tablist`,
                            "w-full justify-start rounded-none border-b border-border",
                            allowScrollbars ? "max-w-full flex-nowrap overflow-x-auto" : "flex-wrap",
                        )}
                    >
                        {tabs.map((tab) => {
                            const transformed = transformTabProperties(tab);
                            const value = String(transformed.id);
                            return (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    disabled={transformed.disabled}
                                    style={transformed.style}
                                    className={cn(
                                        `${eccgui}-tabs__tab`,
                                        "flex-none",
                                        fill && "flex-1",
                                        transformed.className,
                                    )}
                                    data-test-id={transformed["data-test-id"]}
                                    data-testid={transformed["data-testid"]}
                                >
                                    {transformed.title}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    {tabs
                        .filter((tab) => tab.panel != null)
                        .map((tab) => {
                            const value = String(tab.id);
                            return (
                                <TabsContent
                                    key={value}
                                    value={value}
                                    // Blueprint's default (`renderActiveTabPanelOnly === false`) keeps every panel
                                    // mounted in the DOM but hidden; replicate that with `forceMount` + hiding the
                                    // inactive ones. When `true`, fall back to Radix' default (only active mounted).
                                    forceMount={renderActiveTabPanelOnly ? undefined : true}
                                    className={cn(
                                        `${eccgui}-tab__panel`,
                                        !renderActiveTabPanelOnly && "data-[state=inactive]:hidden",
                                        tab.panelClassName,
                                    )}
                                >
                                    {tab.panel}
                                </TabsContent>
                            );
                        })}
                </>
            ) : (
                children
            )}
        </TabsRoot>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-tabs__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {tabsContent}
        </div>
    ) : (
        <>{tabsContent}</>
    );
};

export default Tabs;
