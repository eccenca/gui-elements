import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import * as TypographyClassNames from "./classnames";

type WhiteSpaceSizes = "tiny" | "small" | "regular" | "large" | "xlarge";

export interface WhiteSpaceContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Insert line breaks within an otherwise unbreakable string to prevent text from overflowing the container.
     */
    linebreakForced?: boolean;
    /**
     * Size of top margin around the container.
     */
    marginTop?: WhiteSpaceSizes;
    /**
     * Size of right margin around the container.
     */
    marginRight?: WhiteSpaceSizes;
    /**
     * Size of bottom margin around the container.
     */
    marginBottom?: WhiteSpaceSizes;
    /**
     * Size of left margin around the container.
     */
    marginLeft?: WhiteSpaceSizes;
    /**
     * Size of top padding inside the container.
     */
    paddingTop?: WhiteSpaceSizes;
    /**
     * Size of right padding inside the container.
     */
    paddingRight?: WhiteSpaceSizes;
    /**
     * Size of bottom padding inside the container.
     */
    paddingBottom?: WhiteSpaceSizes;
    /**
     * Size of left padding inside the container.
     */
    paddingLeft?: WhiteSpaceSizes;
}

// Per-side margin/padding Tailwind for each size (was the `@each` whitespace loop in
// typography.scss). Arbitrary values preserve the exact legacy metrics: `regular` = the 14px
// typography base, `tiny`/`small`/`large`/`xlarge` = ×0.25 / ×0.5 / ×1.5 / ×2. Full static
// strings so Tailwind's scanner can see them.
type WhiteSpacePlace =
    | "marginTop"
    | "marginRight"
    | "marginBottom"
    | "marginLeft"
    | "paddingTop"
    | "paddingRight"
    | "paddingBottom"
    | "paddingLeft";

const whitespaceTw: Record<WhiteSpacePlace, Record<WhiteSpaceSizes, string>> = {
    marginTop: { tiny: "mt-[3.5px]", small: "mt-[7px]", regular: "mt-[14px]", large: "mt-[21px]", xlarge: "mt-[28px]" },
    marginRight: { tiny: "mr-[3.5px]", small: "mr-[7px]", regular: "mr-[14px]", large: "mr-[21px]", xlarge: "mr-[28px]" },
    marginBottom: { tiny: "mb-[3.5px]", small: "mb-[7px]", regular: "mb-[14px]", large: "mb-[21px]", xlarge: "mb-[28px]" },
    marginLeft: { tiny: "ml-[3.5px]", small: "ml-[7px]", regular: "ml-[14px]", large: "ml-[21px]", xlarge: "ml-[28px]" },
    paddingTop: { tiny: "pt-[3.5px]", small: "pt-[7px]", regular: "pt-[14px]", large: "pt-[21px]", xlarge: "pt-[28px]" },
    paddingRight: { tiny: "pr-[3.5px]", small: "pr-[7px]", regular: "pr-[14px]", large: "pr-[21px]", xlarge: "pr-[28px]" },
    paddingBottom: { tiny: "pb-[3.5px]", small: "pb-[7px]", regular: "pb-[14px]", large: "pb-[21px]", xlarge: "pb-[28px]" },
    paddingLeft: { tiny: "pl-[3.5px]", small: "pl-[7px]", regular: "pl-[14px]", large: "pl-[21px]", xlarge: "pl-[28px]" },
};

/**
 * Simple container to add whitespace inside and around of it without adding style attributes directly.
 * This way the added whitespace keeps visually connected to the other whitespaces used in the application.
 */
export const WhiteSpaceContainer = ({
    className,
    children,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    linebreakForced = false,
    ...otherDivProps
}: WhiteSpaceContainerProps) => {
    const elementClassName = `${eccgui}-typography__whitespace`;

    return (
        <div
            className={cn(
                elementClassName,
                marginTop && `${elementClassName}-margintop-${marginTop}`,
                marginTop && whitespaceTw.marginTop[marginTop],
                marginRight && `${elementClassName}-marginright-${marginRight}`,
                marginRight && whitespaceTw.marginRight[marginRight],
                marginBottom && `${elementClassName}-marginbottom-${marginBottom}`,
                marginBottom && whitespaceTw.marginBottom[marginBottom],
                marginLeft && `${elementClassName}-marginleft-${marginLeft}`,
                marginLeft && whitespaceTw.marginLeft[marginLeft],
                paddingTop && `${elementClassName}-paddingtop-${paddingTop}`,
                paddingTop && whitespaceTw.paddingTop[paddingTop],
                paddingRight && `${elementClassName}-paddingright-${paddingRight}`,
                paddingRight && whitespaceTw.paddingRight[paddingRight],
                paddingBottom && `${elementClassName}-paddingbottom-${paddingBottom}`,
                paddingBottom && whitespaceTw.paddingBottom[paddingBottom],
                paddingLeft && `${elementClassName}-paddingleft-${paddingLeft}`,
                paddingLeft && whitespaceTw.paddingLeft[paddingLeft],
                linebreakForced && TypographyClassNames.FORCELINEBREAK,
                linebreakForced && "[word-break:normal] [overflow-wrap:anywhere]",
                className,
            )}
            {...otherDivProps}
        >
            {children}
        </div>
    );
};

export default WhiteSpaceContainer;
