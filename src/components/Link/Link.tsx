import React from "react";
import { Link as CarbonLink, LinkProps as CarbonLinkProps } from "@carbon/react";

import { openInNewTab } from "../../common/utils/openInNewTab";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type LinkProps = Omit<CarbonLinkProps<"a">, "ref">;

export const Link = ({ className = "", children, href, onClick, ...otherProps }: LinkProps) => {
    return (
        <CarbonLink
            className={`${eccgui}-link ` + className}
            {...otherProps}
            href={href}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => openInNewTab(e, onClick, href)}
        >
            {children}
        </CarbonLink>
    );
};

export default Link;
