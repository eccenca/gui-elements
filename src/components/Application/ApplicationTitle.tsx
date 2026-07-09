import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type SvgDepiction = HTMLElement & SVGElement;
type ImgDepiction = HTMLElement & HTMLImageElement;

export type ApplicationTitleProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "prefix"> & {
    /**
        prefix displayed before the application name, e.g. the company name
    */
    prefix?: string;
    /**
        application logo, <img>, <svg> or react element
    */
    depiction?: ImgDepiction | SvgDepiction | React.ReactNode;
    /**
        is the application title visually displayed or not
    */
    isNotDisplayed?: boolean;
    /**
        if displayed, is the width aligned with displayed sidebar navigation
    */
    isAlignedWithSidebar?: boolean;
    /**
        is the sidebar navigation currently displayed or not
    */
    isApplicationSidebarExpanded: boolean;
    /**
        native attributes for the anchor HTML element (<a>)
    */
    htmlAProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    /**
     * @deprecated Former Carbon `HeaderName` pass-through, has no effect anymore.
     */
    as?: React.ElementType;
    /**
     * @deprecated Former Carbon `HeaderName` pass-through, has no effect anymore.
     */
    element?: React.ElementType;
    /**
     * @deprecated Former Carbon `HeaderName` pass-through, has no effect anymore.
     */
    isSideNavExpanded?: boolean;
};

export const ApplicationTitle = ({
    children,
    className = "",
    prefix = "",
    href,
    depiction,
    isNotDisplayed = false,
    isAlignedWithSidebar = false,
    isApplicationSidebarExpanded,
    htmlAProps,
    // deprecated no-op props, destructured so they never leak onto the DOM
    as: _as,
    element: _element,
    isSideNavExpanded: _isSideNavExpanded,
    ...otherAnchorProps
}: ApplicationTitleProps) => {
    const classApplication = `${eccgui}-application__title`;
    // visually hidden (but kept for assistive tech) via `sr-only`
    const classNotDisplayed =
        isNotDisplayed || (!isApplicationSidebarExpanded && typeof isNotDisplayed === "undefined")
            ? cn(`${eccgui}-application__title--nodisplay`, "sr-only")
            : "";
    // 232px = the expanded sidebar (288px / `w-58`) minus the sidebar toggler (56px)
    const classAlignedSidebar =
        isAlignedWithSidebar || isApplicationSidebarExpanded
            ? cn(`${eccgui}-application__title--withsidebar`, "w-58 shrink-0 pr-[7px]")
            : "";

    return (
        <a
            {...otherAnchorProps}
            {...htmlAProps}
            className={cn(
                // inherit the header text color (no link color / underline) + stock keyboard focus ring
                "flex h-full shrink-0 select-none items-center pl-4 pr-8 text-current no-underline outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                classApplication,
                classAlignedSidebar,
                classNotDisplayed,
                className,
            )}
            href={href}
        >
            <span
                className={cn(
                    // 12px caption (`text-xs` = 12px/16px line-height), semibold, wide tracking, ellipsized
                    "inline-block overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold tracking-[0.5px]",
                    `${eccgui}-application__title--content`,
                )}
            >
                {!!depiction && (
                    <>
                        <span
                            className={cn(
                                // logo box: only <img>/<svg> children are shown, capped at 35px and
                                // vertically inset by 10px/11px so the 35px glyph spans the 56px header
                                "mr-[7px] inline-block [&>*]:hidden [&>:is(img,svg)]:inline [&>:is(img,svg)]:h-auto [&>:is(img,svg)]:max-h-[35px] [&>:is(img,svg)]:w-auto [&>:is(img,svg)]:max-w-[35px] [&>:is(img,svg)]:p-0 [&>:is(img,svg)]:align-middle [&>:is(img,svg)]:my-2.5",
                                `${eccgui}-application__title--depiction`,
                            )}
                        >
                            {React.isValidElement(depiction) ? (
                                depiction
                            ) : depiction instanceof HTMLElement ? (
                                <>{depiction.outerHTML}</>
                            ) : (
                                depiction
                            )}
                        </span>
                    </>
                )}
                {!!prefix && (
                    <>
                        <span className={cn("font-normal", `${eccgui}-application__title--prefix`)}>{prefix}</span>
                        &nbsp;
                    </>
                )}
                {children}
            </span>
        </a>
    );
};

export default ApplicationTitle;
