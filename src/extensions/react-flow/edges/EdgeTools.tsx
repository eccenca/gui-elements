import React, {memo} from 'react';
import {ContextOverlay} from "../../../index";
import {CLASSPREFIX as eccgui} from "../../../configuration/constants";
import {
    PopoverInteractionKind as BlueprintPopoverInteractionKind,
} from "@blueprintjs/core";

import { ContextOverlayProps } from "./../../../components/ContextOverlay/ContextOverlay";

interface PosOffset {
    left: number;
    top: number;
}

export interface EdgeToolsProps extends ContextOverlayProps {
    posOffset: PosOffset;
    children: string | JSX.Element | JSX.Element[];
}

export const EdgeTools = memo(
    ({
        posOffset,
        children,
        ...otherProps
    }: EdgeToolsProps) => {
        return (
            <div className={`${eccgui}-graphviz__edgetools-target`} style={{ ...posOffset }}>
                <ContextOverlay
                    {...otherProps}
                    defaultIsOpen={true}
                    autoFocus={true}
                    interactionKind={BlueprintPopoverInteractionKind.HOVER}
                    content={<div className={`${eccgui}-graphviz__edgetools-content`}>{children}</div>}
                    popoverClassName={`${eccgui}-graphviz__edgetools-overlay`}
                >
                    <div className={`${eccgui}-graphviz__edgetools-target`} style={{ ...posOffset }} />
                </ContextOverlay>
            </div>
        );
    }
);
