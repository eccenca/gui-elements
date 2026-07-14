import React from "react";
import Color from "color";

import {
    Divider,
    Icon,
    IconButton,
    OverflowText,
    Section,
    SectionHeader,
    Spacing,
    StickyTarget,
    StickyTargetProps,
    Toolbar,
    ToolbarSection,
    Tooltip,
} from "@/components";
import { TestableComponent } from "@/components/interfaces";
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface ContentGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, TestableComponent {
    /**
     * Title of the content group.
     */
    title?: string;
    /**
     * Level of the content group.
     */
    level?: number;
    /**
     * Context information to display in the header.
     */
    contextInfo?: React.ReactElement | React.ReactElement[];
    /**
     * Annotation to display in the content.
     */
    annotation?: React.ReactElement | React.ReactElement[];
    /**
     * Action options to display in the header.
     */
    actionOptions?: React.ReactElement | React.ReactElement[];
    /**
     * Flag to collapse the content group.
     */
    isCollapsed?: boolean;
    /**
     * Text to display when the callapse button is hovered.
     * If not set then it uses "Show more" or "Show less".
     */
    textToggleCollapse?: string;
    /**
     * Event handler to toggle the collapse state.
     */
    handlerToggleCollapse?: () => void;
    /**
     * Use a border on the left side to visually connect the whole content content group.
     */
    borderMainConnection?: boolean;
    /**
     * Use a border on the left side to visually emphase the content group.
     * If it is set to an array of color codes then the border is multi colored.
     */
    borderSubConnection?: boolean | string[];
    /**
     * Whitespace size between header and the content.
     */
    whitespaceSize?: "tiny" | "small" | "medium" | "large" | "xlarge";
    /**
     * Title minimum headline level.
     */
    minimumHeadlineLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Props to pass to `StickyTarget`.
     */
    stickyHeaderProps?: Omit<StickyTargetProps, "children">;
    /**
     * Description of the content group.
     * Added as tooltip to an info icon placed in the content group header.
     */
    description?: string;
    /**
     * Flag to hide the group divider.
     */
    hideGroupDivider?: boolean;
    /**
     * Additional props to pass to the content container.
     */
    contentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
}

/**
 * Manage display of a grouped content section.
 * Add info, actions and context annotations by using its properties.
 * Can be nested into each other.
 */
export const ContentGroup = ({
    children,
    className = "",
    title,
    contextInfo,
    annotation,
    actionOptions,
    isCollapsed = false,
    textToggleCollapse,
    handlerToggleCollapse,
    borderMainConnection = false,
    borderSubConnection = false,
    level = 1,
    minimumHeadlineLevel = 3,
    whitespaceSize = "small",
    style,
    stickyHeaderProps,
    description,
    hideGroupDivider,
    contentProps,
    ...otherContentWrapperProps
}: ContentGroupProps) => {
    const displayHeader = title || handlerToggleCollapse;

    let borderGradient: string[] | undefined = undefined;
    if (typeof borderSubConnection === "object") {
        const borderColors: string[] = Array.isArray(borderSubConnection) ? borderSubConnection : [borderSubConnection];
        borderGradient = borderColors.reduce((acc: string[], borderColor: string, index: number): string[] => {
            try {
                const color = Color(borderColor);

                acc.push(
                    `${color.rgb().toString()} ` +
                        `${(index / borderColors.length) * 100}% ` +
                        `${((index + 1) / borderColors.length) * 100}%`,
                );
            } catch {
                // eslint-disable-next-line no-console
                console.warn("Received invalid background color for tag: " + borderColor);
            }
            return acc;
        }, []);
    }

    const contextInfoElements = Array.isArray(contextInfo) ? contextInfo : [contextInfo];
    const { className: contentClassName, ...otherContentProps } = contentProps ?? {};

    const headerContent = displayHeader ? (
        <>
            <SectionHeader className={`${eccgui}-contentgroup__header`}>
                <Toolbar>
                    {handlerToggleCollapse && (
                        <ToolbarSection>
                            <IconButton
                                className={`${eccgui}-contentgroup__header__toggler`}
                                name={isCollapsed ? "toggler-showmore" : "toggler-showless"}
                                text={textToggleCollapse ?? (isCollapsed ? "Show more" : "Show less")}
                                onClick={handlerToggleCollapse}
                            />
                            <Spacing vertical size="small" />
                        </ToolbarSection>
                    )}
                    {title && (
                        <ToolbarSection canShrink>
                            {React.createElement(
                                "h" +
                                    Math.min(
                                        Math.max(minimumHeadlineLevel, level + minimumHeadlineLevel),
                                        6,
                                    ).toString(),
                                {
                                    children: <OverflowText>{title}</OverflowText>,
                                    className: `${eccgui}-contentgroup__header__title`,
                                },
                            )}
                            {description && (
                                <>
                                    <Spacing vertical size="tiny" />
                                    <Tooltip content={description}>
                                        <Icon name="item-info" small className="dmapp--text-info" />
                                    </Tooltip>
                                </>
                            )}
                        </ToolbarSection>
                    )}
                    {contextInfoElements &&
                        Boolean(contextInfoElements[0]?.props) &&
                        Object.values((contextInfoElements[0]?.props ?? {}) as object).every((v) => v !== undefined) && (
                            <ToolbarSection className={`${eccgui}-contentgroup__header__context`} canGrow>
                                <div className={cn(`${eccgui}-contentgroup__content`, "flex")}>
                                    <Spacing vertical size="tiny" />
                                    {contextInfoElements}
                                </div>
                            </ToolbarSection>
                        )}
                    {(!isCollapsed || !handlerToggleCollapse) && actionOptions && (
                        <ToolbarSection className={cn(`${eccgui}-contentgroup__header__options`, "print:hidden")}>
                            <Spacing vertical size="small" />
                            {actionOptions}
                        </ToolbarSection>
                    )}
                </Toolbar>
            </SectionHeader>
            {(!isCollapsed || !handlerToggleCollapse) && (
                <>
                    {!hideGroupDivider && <Divider addSpacing="small" />}
                    <Spacing size={whitespaceSize} />
                </>
            )}
        </>
    ) : (
        <></>
    );

    return (
        <Section
            // was `_contentgroup.scss`. The border colours default via the
            // `--eccgui-color-contentgroup-border-*` custom properties (the `-sub` one is still
            // overridden inline below for the multi-colour gradient case). The `eccgui` prefix is
            // spelled out in the arbitrary utilities because Tailwind's scanner needs static
            // strings. Only the `--padding-small` (default) variant carries the extra offsets.
            className={cn(
                `${eccgui}-contentgroup`,
                whitespaceSize && `${eccgui}-contentgroup--padding-${whitespaceSize}`,
                whitespaceSize === "small" && "[&+.eccgui-contentgroup]:mt-[7px]",
                borderMainConnection && `${eccgui}-contentgroup--border-main`,
                borderMainConnection &&
                    "[--eccgui-color-contentgroup-border-main:color-mix(in_oklch,var(--muted-foreground)_35%,transparent)] [border-left:3.5px_solid_var(--eccgui-color-contentgroup-border-main)]",
                borderMainConnection && whitespaceSize === "small" && "pl-[7px]",
                borderSubConnection && `${eccgui}-contentgroup--border-sub`,
                borderSubConnection &&
                    "relative [border-right:3.5px_solid_transparent] [--eccgui-color-contentgroup-border-sub:color-mix(in_oklch,var(--muted-foreground)_20%,transparent)] after:absolute after:top-0 after:bottom-0 after:left-full after:w-[3.5px] after:content-[''] after:[background-color:var(--eccgui-color-contentgroup-border-sub)] after:[background-image:linear-gradient(to_bottom,var(--eccgui-color-contentgroup-border-sub))] print:after:[print-color-adjust:exact]",
                borderSubConnection && whitespaceSize === "small" && "pr-[7px]",
                className,
            )}
            style={
                borderGradient
                    ? ({
                          ...(style ?? {}),
                          [`--${eccgui}-color-contentgroup-border-sub`]: borderGradient.join(", "),
                      } as React.CSSProperties)
                    : style
            }
            {...otherContentWrapperProps}
        >
            {headerContent && stickyHeaderProps ? (
                <StickyTarget {...stickyHeaderProps}>{headerContent}</StickyTarget>
            ) : (
                headerContent
            )}
            {(!isCollapsed || !handlerToggleCollapse) && (
                <>
                    <div className={cn(`${eccgui}-contentgroup__content`, "flex", whitespaceSize === "small" && "gap-x-[7px]")}>
                        <div
                            className={cn(`${eccgui}-contentgroup__content__body`, "grow shrink w-full", contentClassName)}
                            {...otherContentProps}
                        >
                            {children}
                        </div>
                        {contextInfo && !displayHeader && (
                            <div className={`${eccgui}-contentgroup__content__context`}>{contextInfoElements}</div>
                        )}
                        {annotation && <div>{annotation}</div>}
                        {actionOptions && !displayHeader && (
                            <div className={`${eccgui}-contentgroup__content__options`}>{actionOptions}</div>
                        )}
                    </div>
                </>
            )}
        </Section>
    );
};
