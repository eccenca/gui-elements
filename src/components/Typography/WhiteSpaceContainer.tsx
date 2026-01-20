import React from "react";

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
            className={
                elementClassName +
                (className ? " " + className : "") +
                (marginTop ? ` ${elementClassName}-margintop-${marginTop}` : "") +
                (marginRight ? ` ${elementClassName}-marginright-${marginRight}` : "") +
                (marginBottom ? ` ${elementClassName}-marginbottom-${marginBottom}` : "") +
                (marginLeft ? ` ${elementClassName}-marginleft-${marginLeft}` : "") +
                (paddingTop ? ` ${elementClassName}-paddingtop-${paddingTop}` : "") +
                (paddingRight ? ` ${elementClassName}-paddingright-${paddingRight}` : "") +
                (paddingBottom ? ` ${elementClassName}-paddingbottom-${paddingBottom}` : "") +
                (paddingLeft ? ` ${elementClassName}-paddingleft-${paddingLeft}` : "") +
                (linebreakForced ? " " + TypographyClassNames.FORCELINEBREAK : "")
            }
            {...otherDivProps}
        >
            {children}
        </div>
    );
};

export default WhiteSpaceContainer;
