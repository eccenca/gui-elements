import React from "react";
import {
    Link as CarbonLink,
    LinkProps as CarbonLinkProps,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { openInNewTab } from "../../common/utils/openInNewTab";

export interface LinkProps extends CarbonLinkProps {};

export const Link = ({
    className = "",
    children,
    href,
    onClick,
    ...otherProps
}: CarbonLinkProps) => {
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
}

export default Link;
