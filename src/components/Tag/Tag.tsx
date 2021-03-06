import React from 'react';
import { Tag as BlueprintTag } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Tag({
    children,
    className = '',
    emphasized = false,
    ...otherProps
}: any) {
    return (
        <BlueprintTag
            {...otherProps}
            className={
                `${eccgui}-tag__item` +
                (className ? ' ' + className : '')
            }
            minimal={!emphasized}
        >
            {children}
        </BlueprintTag>
    );
};

export default Tag;
