import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";



interface ToolbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * when set will allow content grow
   */
  canGrow?: boolean;
  /**
   * when set will allow content to shrink
   */
  canShrink?: boolean;
  /**
   * when set to true hides extended content
   */
  hideOverflow?: boolean;
}

function ToolbarSection({
    children,
    className = '',
    canGrow = false,
    canShrink = false,
    hideOverflow = false,
    ...otherProps
}:ToolbarSectionProps) {
    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-toolbar__section` +
                (canGrow ? ` ${eccgui}-toolbar__section--cangrow` : '') +
                (canShrink ? ` ${eccgui}-toolbar__section--canshrink` : '') +
                (hideOverflow ? ` ${eccgui}-toolbar__section--overflowhidden` : '') +
                (className ? ' ' + className : '')
            }
        >
            { children }
        </div>
    )
}

export default ToolbarSection;
