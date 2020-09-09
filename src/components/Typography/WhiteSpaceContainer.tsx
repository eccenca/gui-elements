import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function WhiteSpaceContainer({
    className = "",
    children,
    marginTop = "", // tiny, small, regular, large, xlarge
    marginRight = "",
    marginBottom = "",
    marginLeft = "",
    paddingTop = "", // tiny, small, regular, large, xlarge
    paddingRight = "",
    paddingBottom = "",
    paddingLeft = "",
    ...otherProps
}: any) {

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
                (paddingTop ? ` ${elementClassName}-paddingtop-${marginTop}` : "") +
                (paddingRight ? ` ${elementClassName}-paddingright-${paddingRight}` : "") +
                (paddingBottom ? ` ${elementClassName}-paddingbottom-${paddingBottom}` : "") +
                (paddingLeft ? ` ${elementClassName}-paddingleft-${paddingLeft}` : "")
            }
        >
            {children}
        </div>
    );
}

export default WhiteSpaceContainer;
