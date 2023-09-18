import React from "react";

import {CLASSPREFIX as eccgui} from "../../../configuration/constants";
import {ContextOverlay, TestableComponent} from "../../../index";

import {ContextOverlayProps} from "./../../../components/ContextOverlay/ContextOverlay";

export interface HandleToolsProps extends Omit<ContextOverlayProps, "children" | "content" | "popoverClassName">, TestableComponent {
    children: string | JSX.Element | JSX.Element[];
}

export const HandleTools = ({ children, ...otherContextOverlayProps }: HandleToolsProps) => {
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
            />
        </ContextOverlay>
    );
};
