import React from "react";
import {
  AnchorButton as BlueprintAnchorButton,
  Button as BlueprintButton,
  ButtonProps as BlueprintButtonProps,
  AnchorButtonProps as BlueprintAnchorButtonProps,
  Intent as BlueprintIntent,
} from "@blueprintjs/core";
import Icon from "../Icon/Icon";
import Tooltip, { TooltipProps } from "./../Tooltip/Tooltip";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type AnchorOrButtonProps = Omit<BlueprintButtonProps, "elementRef" | "icon" | "rightIcon"> | Omit<BlueprintAnchorButtonProps, "elementRef" | "icon" | "rightIcon">;

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
    /**
    * Always use this when the button triggers an affirmative action, e.g. confirm a process.
    * The button is displayed with primary color scheme.
    */
    affirmative?: boolean;
    /**
    * Always use this when the button triggers an disruptive action, e.g. delete or remove.
    * The button is displayed with primary color scheme.
    */
    disruptive?: boolean;
    /**
    * Use this when a button is important enough to highlight it in a set of other buttons.
    * The button is displayed with primary color scheme.
    */
    elevated?: boolean;
    /**
    * The button is displayed with primary color scheme.
    */
    hasStatePrimary?: boolean;
    /**
    * The button is displayed with success (some type of green) color scheme.
    */
    hasStateSuccess?: boolean;
    /**
    * The button is displayed with success (some type of orange) color scheme.
    */
    hasStateWarning?: boolean;
    /**
    * The button is displayed with success (some type of red) color scheme.
    */
    hasStateDanger?: boolean;
    /**
    * takes in either a string of text of a react element to display as a tooltip when the button is hovered.
    */
    tooltip?: string | JSX.Element | null;
    /**
    * Object with additional properties for the tooltip.
    */
    tooltipProperties?: Partial<Omit<TooltipProps, "content" | "children">>;
    /**
    * If an URL is set then the button is included as HTML anchor element instead of a button form element.
    */
    href?: string;
    icon?: string | JSX.Element;
    rightIcon?: string | JSX.Element;
    target?: string;
}

/**
 * Display a button element to enable user interaction.
 * It normally should trigger action when clicked.
 */
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
  icon,
  rightIcon,
  tooltip = null,
  tooltipProperties,
  ...restProps
}: ButtonProps & AnchorOrButtonProps) {
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
