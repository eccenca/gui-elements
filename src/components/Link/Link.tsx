import React from "react";
import { Link as CarbonLink, LinkProps as CarbonLinkProps } from "carbon-components-react";

import { openInNewTab } from "../../common/utils/openInNewTab";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type LinkProps = CarbonLinkProps;

export const Link = ({ className = "", children, href, onClick, ...otherProps }: CarbonLinkProps) => {
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
