import React from 'react';
import {
    InputGroup as BlueprintInputGroup,
    Classes as BlueprintClassNames,
    Intent as BlueprintIntent,
 } from "@blueprintjs/core";
import Icon from '../Icon/Icon';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function TextField({
    className='',
    hasStatePrimary=false,
    hasStateSuccess=false,
    hasStateWarning=false,
    hasStateDanger=false,
    leftIcon=false,
    fullWidth=false,
    ...otherProps
}: any) {

    let intent;
    switch (true) {
        case hasStatePrimary:
            intent = BlueprintIntent.PRIMARY;
            break;
        case hasStateSuccess:
            intent = BlueprintIntent.SUCCESS;
            break;
        case hasStateWarning:
            intent = BlueprintIntent.WARNING;
            break;
        case hasStateDanger:
            intent = BlueprintIntent.DANGER;
            break;
        default:
            break;
    }

    return (
        <BlueprintInputGroup
            className={`${eccgui}-textfield ` + className}
            intent={intent}
            fill={fullWidth}
            {...otherProps}
            leftIcon={
                leftIcon !== false ? (typeof leftIcon === 'string' ? <Icon name={leftIcon} className={BlueprintClassNames.ICON} intent={intent} /> : <span className={BlueprintClassNames.ICON}>{leftIcon}</span>) : leftIcon
            }
            dir={'auto'}
        />
    );
};

export default TextField;
