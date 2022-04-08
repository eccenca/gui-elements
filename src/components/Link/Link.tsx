import React from "react";
import {Link as CarbonLink} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { openInNewTab } from "../../common/utils/openInNewTab";

function Link({ className = "", children, href, onClick,  ...otherProps }: any) {
    return (
      <CarbonLink
        className={`${eccgui}-link ` + className}
        {...otherProps}
        href={href}
        onClick={(e: React.MouseEvent<HTMLElement>) => openInNewTab(e, onClick, href)}
      >
        {children}
      </CarbonLink>
    );
}

export default Link;
