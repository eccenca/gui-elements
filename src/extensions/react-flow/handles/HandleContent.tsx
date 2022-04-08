import React, {memo} from 'react';
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { Tooltip } from "../../../index";

export interface HandleContentProps {
    children?: JSX.Element | string;
    extendedTooltip?: JSX.Element | string;
}

export const HandleContent = memo(({
    children,
    extendedTooltip
}: HandleContentProps) => {
    const handleContent = !!children ? (
        <div className={`${eccgui}-graphviz__handle__content`}>
            { children }
        </div>
    ) : !!extendedTooltip ? (
        <div className={`${eccgui}-graphviz__handle__content`} />
    ) : (
        <></>
    );

    if (!!extendedTooltip) {
        return (
            <Tooltip
                content={extendedTooltip}
                wrapperTagName="div"
                autoFocus={false}
                enforceFocus={false}
                openOnTargetFocus={false}
            >
                { handleContent }
            </Tooltip>
        );
    }

    return handleContent;
});
