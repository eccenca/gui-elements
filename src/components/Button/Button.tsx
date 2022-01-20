import React from "react";
import {
  AnchorButton as BlueprintAnchorButton,
  Button as BlueprintButton,
  Intent as BlueprintIntent,
} from "@blueprintjs/core";
import Icon from "../Icon/Icon";
import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * when set to true the button takes primary state button styles
   */
  affirmative?: boolean;
  /**
   * when set to true the button takes danger state button styles
   */
  disruptive?: boolean;
  /**
   * when set to true the button takes primary button styles
   */
  elevated?: boolean;
  /**
   * when set to true the button takes a blue background color
   */
  hasStatePrimary?: boolean;
  /**
   * when set to true the button takes a green background color
   */
  hasStateSuccess?: boolean;
  /**
   * when set to true the button takes an orange background color
   */
  hasStateWarning?: boolean;
  /**
   * when set to true the button takes a red background color
   */
  hasStateDanger?: boolean;
  /**
   * Takes in a react component or a string that corresponds
   * to a valid icon name, when added will add an Icon at
   * the start of the button before the text
   */
  icon?: string | JSX.Element | null;
  /**
   *  Takes in a react component or a string that corresponds to a valid icon
   *  name, when added will add an Icon to right of the text
   */
  rightIcon?: string | JSX.Element | null;
  /**
   * If set to `true`, the button will display a centered loading spinner instead of its contents
   */
  loading?: boolean;
  /**
   * takes in either a string of text of a react element to display as a tooltip when the button is hovered
   */
  tooltip?: string | JSX.Element | null;
  tooltipProperties?: Partial<Omit<TooltipProps, "content" | "children">>;
  href?: string;
  /**
   * text to display in button
   */
  text?: string;
}

function Button({
  children,
  className = "",
  affirmative = false,
  disruptive = false,
  elevated = false,
  hasStatePrimary = false,
  hasStateSuccess = false,
  hasStateWarning = false,
  hasStateDanger = false,
  icon = null,
  rightIcon = null,
  tooltip = null,
  tooltipProperties,
  ...restProps
}: ButtonProps) {
  let intention;
  switch (true) {
    case affirmative || elevated || hasStatePrimary:
      intention = BlueprintIntent.PRIMARY;
      break;
    case hasStateSuccess:
      intention = BlueprintIntent.SUCCESS;
      break;
    case hasStateWarning:
      intention = BlueprintIntent.WARNING;
      break;
    case disruptive || hasStateDanger:
      intention = BlueprintIntent.DANGER;
      break;
    default:
      break;
  }

  let ButtonType = restProps.href ? BlueprintAnchorButton : BlueprintButton;

  const button = (
    <ButtonType
      {...restProps}
      className={`${eccgui}-button ` + className}
      intent={intention}
      icon={typeof icon === "string" ? <Icon name={icon} /> : icon}
      rightIcon={
        typeof rightIcon === "string" ? <Icon name={rightIcon} /> : rightIcon
      }
    >
      {children}
    </ButtonType>
  );

  return tooltip ? (
    <Tooltip content={tooltip} {...tooltipProperties}>
      <span>{button}</span>
    </Tooltip>
  ) : (
    button
  );
}

export default Button;
