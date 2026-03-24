import React, {DOMAttributes} from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Set an inverse direction of how the elements are aligned.
     * Mainly used for cards used as modals (dialogs).
     */
    inverseDirection?: boolean;
    /**
     * Set footer to display its children on only one line.
     */
    noWrap?: boolean;

    /** Prevents all events related to button clicks from bubbling further up. */
    preventEvents?: boolean;
}

const stopEvent = (event: React.SyntheticEvent) => {
    event.stopPropagation()
}

/**
 * Contains a footer with user-interaction elements like buttons for the `Card` element.
 * Content must be ordered by importance, so the main action comes before other actions.
 */
export const CardActions = ({
    children,
    className = "",
    inverseDirection = false,
    noWrap = false,
    preventEvents = false,
    ...otherProps
}: CardActionsProps) => {
    let htmlElementProps: DOMAttributes<HTMLElement> = Object.create(null)
    if (preventEvents) {
        htmlElementProps = {
            onPointerDown: stopEvent,
            onMouseDown: stopEvent,
            onPointerUp: stopEvent,
            onMouseUp: stopEvent,
            onClick: stopEvent
        }
    }
    return (
        <footer
            {...htmlElementProps}
            {...otherProps}
            className={
                `${eccgui}-card__actions` +
                (inverseDirection ? ` ${eccgui}-card__actions--inversedirection` : "") +
                (noWrap ? ` ${eccgui}-card__actions--nowrap` : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </footer>
    );
};

export default CardActions;
