/*
    provides a simple interface for dialogs using modals with a card inside
*/

import React, { SyntheticEvent } from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import * as IntentClassNames from "./../Intent/classnames";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../Card";
import Divider from "./../Separation/Divider";
import Modal, { IModalProps } from "./Modal";
import { IconButton } from "@gui-elements/index";
import { OverviewItem } from "../OverviewItem";

export interface ISimpleDialogProps extends IModalProps {
  // The title of the dialog
  title?: string;
  // include elements to the action row, e.g. Buttons
  actions?: React.ReactNode | React.ReactNode[];
  notifications?: React.ReactNode | React.ReactNode[];
  // If this dialog should have borders or not
  hasBorder?: boolean;
  // If enabled neither closing via ESC key or clicking outside of the component will work, except explicitly specified.
  preventSimpleClosing?: boolean;
  // add special class name to display intent of dialog
  intentClassName?:
    | typeof IntentClassNames.INFO
    | typeof IntentClassNames.SUCCESS
    | typeof IntentClassNames.WARNING
    | typeof IntentClassNames.DANGER;
  // determines if the info icon should show
  shouldShowInfo?: boolean;
  //handler that pops the info dialog
  handleInfoClick?: (e: SyntheticEvent<HTMLButtonElement>) => void;
}

function SimpleDialog({
  children,
  canOutsideClickClose = false,
  canEscapeKeyClose = false,
  title = "",
  actions = null,
  notifications = null,
  hasBorder = false,
  preventSimpleClosing = false,
  intentClassName = "",
  shouldShowInfo = false,
  handleInfoClick,
  ...otherProps
}: ISimpleDialogProps) {
  return (
    <Modal
      {...otherProps}
      canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
      canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
    >
      <Card
        className={intentClassName ? intentClassName : ""}
        // FIXME: this is a workaround because data ttribute on SimpleDialog is not correctly routed to the overlay by blueprint js
        data-test-id={"simpleDialogWidget"}
      >
        {title && (
          <OverviewItem>
            <CardHeader>
              <CardTitle className={intentClassName ? intentClassName : ""}>
                {title}
              </CardTitle>
            </CardHeader>
            {shouldShowInfo ? (
              <IconButton name="item-info" onClick={handleInfoClick} />
            ) : null}
          </OverviewItem>
        )}
        {hasBorder && <Divider />}
        <CardContent>{children}</CardContent>
        {hasBorder && <Divider />}
        {!!notifications && (
          <CardContent className={`${eccgui}-dialog__notifications`}>
            {notifications}
          </CardContent>
        )}
        {actions && (
          <CardActions
            inverseDirection
            className={intentClassName ? intentClassName : ""}
          >
            {actions}
          </CardActions>
        )}
      </Card>
    </Modal>
  );
}

export default SimpleDialog;
