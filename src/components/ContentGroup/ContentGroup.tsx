import React from "react";
import classNames from "classnames";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
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
} from "../index";

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
     * Text to display when the callpse button is hovered.
     */
    onCollapseText?: string;
    /**
     * Event handler to toggle the collapse state.
     */
    handlerToggleCollapse?: () => void;
    /**
     * Main border connection, visually emphasizes the main content.
     */
    borderMainConnection?: boolean;
    /**
     * Sub border connection, visually emphasizes additional content properties.
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

export const ContentGroup = ({
    children,
    className = "",
    title,
    contextInfo,
    annotation,
    actionOptions,
    isCollapsed = false,
    onCollapseText,
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

    let borderGradient: string | undefined = undefined;
    if (typeof borderSubConnection === "object") {
        const borderColors: string[] = Array.isArray(borderSubConnection) ? borderSubConnection : [borderSubConnection];
        borderGradient = borderColors.every((color) => CSS.supports("color", color))
            ? borderColors
                  .map((color, index) => {
                      return (
                          `${color} ` +
                          `${(index / borderColors.length) * 100}% ` +
                          `${((index + 1) / borderColors.length) * 100}%`
                      );
                  })
                  .join(", ")
            : undefined;
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
                                text={onCollapseText ?? isCollapsed ? "Show more" : "Show less"}
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
                                        6
                                    ).toString(),
                                {
                                    children: <OverflowText>{title}</OverflowText>,
                                    className: `${eccgui}-contentgroup__header__title`,
                                }
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
                        contextInfoElements[0]?.props &&
                        Object.values(contextInfoElements[0].props).every((v) => v !== undefined) && (
                            <ToolbarSection className={`${eccgui}-contentgroup__header__context`} canGrow>
                                <div className={`${eccgui}-contentgroup__content `}>
                                    <Spacing vertical size="tiny" />
                                    {contextInfo}
                                </div>
                            </ToolbarSection>
                        )}
                    {!isCollapsed && handlerToggleCollapse && actionOptions && (
                        <ToolbarSection className={`${eccgui}-contentgroup__header__options`}>
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
            className={
                `${eccgui}-contentgroup` +
                (className ? ` ${className}` : "") +
                (whitespaceSize ? ` ${eccgui}-contentgroup--padding-${whitespaceSize}` : "") +
                (borderMainConnection ? ` ${eccgui}-contentgroup--border-main` : "") +
                (borderSubConnection ? ` ${eccgui}-contentgroup--border-sub` : "")
            }
            style={
                borderGradient
                    ? ({
                          ...(style ?? {}),
                          [`--${eccgui}-color-contentgroup-border-sub`]: borderGradient,
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
                    <div className={`${eccgui}-contentgroup__content`}>
                        <div
                            className={classNames(`${eccgui}-contentgroup__content__body`, contentClassName)}
                            {...otherContentProps}
                        >
                            {children}
                        </div>
                        {contextInfo && !displayHeader && (
                            <div className={`${eccgui}-contentgroup__content__context`}>{contextInfo}</div>
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
