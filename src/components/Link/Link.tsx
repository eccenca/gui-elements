import React from "react";
import _Link from "carbon-components-react/lib/components/Link";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { openInNewTab } from "../../common/utils/openInNewTab";

const CarbonLink = _Link;

function Link({ className = "", children, href, onClick,  ...otherProps }: any) {
    return (
      <CarbonLink
        className={`${eccgui}-link ` + className}
        {...otherProps}
        href={href}
        onClick={(e) => openInNewTab(e, onClick, href)}
      >
        {children}
      </CarbonLink>
    );
}

export default Link;
