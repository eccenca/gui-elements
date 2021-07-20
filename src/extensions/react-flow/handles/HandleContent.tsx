import React, {memo} from 'react';
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { Tooltip } from "@gui-elements/index";

export interface HandleContentProps {
    children?: string | React.ReactNode;
    extendedTooltip?: string | React.ReactNode;
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
