import React from "react";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import {ContextOverlay, TestableComponent} from "../../../index";

import { ContextOverlayProps } from "./../../../components/ContextOverlay/ContextOverlay";

export interface HandleToolsProps extends Omit<ContextOverlayProps, "children" | "content" | "popoverClassName">, TestableComponent {
    children: string | JSX.Element | JSX.Element[];
    /** Elements that are part of the tool target itself and not of the context overlay, i.e. they are always visible. */
    handleToolTargetChildren?: JSX.Element | JSX.Element[]
}

export const HandleTools = ({ children, handleToolTargetChildren, ...otherContextOverlayProps }: HandleToolsProps) => {
    return (
        <ContextOverlay
            hoverCloseDelay={500}
            {...otherContextOverlayProps}
            content={<div className={`${eccgui}-graphviz__handletools-content`}>{children}</div>}
            popoverClassName={`${eccgui}-graphviz__handletools-overlay`}
        >
            <div
                className={`${eccgui}-graphviz__handletools-target`}
                data-test-id={otherContextOverlayProps["data-test-id"]}
            >
                {handleToolTargetChildren}
            </div>
        </ContextOverlay>
    );
};
