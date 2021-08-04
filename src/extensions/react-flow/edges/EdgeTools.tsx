import React, {memo} from 'react';
import {ContextOverlay} from "@gui-elements/index";
import {CLASSPREFIX as eccgui} from "@gui-elements/src/configuration/constants";
import {
    IPopoverProps as IBlueprintPopoverProps,
    PopoverInteractionKind as BlueprintPopoverInteractionKind,
} from "@blueprintjs/core";

interface PosOffset {
    left: number;
    top: number;
}

export interface EdgeToolsProps extends IBlueprintPopoverProps {
    posOffset: PosOffset;
    children: string | JSX.Element;
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
                    target={<div className={`${eccgui}-graphviz__edgetools-target`} style={{ ...posOffset }} />}
                    popoverClassName={`${eccgui}-graphviz__edgetools-overlay`}
                />
            </div>
        );
    }
);
