import React from "react";
import { PopoverInteractionKind as BlueprintPopoverInteractionKind } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ContextOverlay, TestableComponent } from "../../../index";

import { ContextOverlayProps } from "./../../../components/ContextOverlay/ContextOverlay";

export interface HandleToolsProps
    extends Omit<ContextOverlayProps, "children" | "content" | "popoverClassName">,
        TestableComponent {
    children: string | React.JSX.Element | React.JSX.Element[];
}

export const HandleTools = ({ children, ...otherContextOverlayProps }: HandleToolsProps) => {
    const [toolsDisplayed, setToolsDisplayed] = React.useState<boolean>(false);

    const configToolsDisplayed = toolsDisplayed
        ? {
              defaultIsOpen: true,
              autoFocus: false,
              interactionKind: BlueprintPopoverInteractionKind.CLICK,
              openOnTargetFocus: true,
              onClosing: () => setToolsDisplayed(false),
          }
        : {
              onOpening: () => {
                  setToolsDisplayed(true);
              },
          };

    return (
        <ContextOverlay
            hoverCloseDelay={500}
            {...configToolsDisplayed}
            {...otherContextOverlayProps}
            content={<div className={`${eccgui}-graphviz__handletools-content`}>{children}</div>}
            className={`${eccgui}-graphviz__handletools-target`}
            popoverClassName={`${eccgui}-graphviz__handletools-overlay`}
        >
            <div
                className={`${eccgui}-graphviz__handletools-placeholder`}
                data-test-id={otherContextOverlayProps["data-test-id"]}
                data-testid={otherContextOverlayProps["data-testid"]}
            />
        </ContextOverlay>
    );
};
