import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Set an inverse direction of how the elements are aligned.
     * Mainly used for cards used as modals (dialogs).
     */
    inverseDirection?: boolean;
}

/**
 * Contains a footer with user-interaction elements like buttons for the `Card` element.
 * Content must be ordered by importance, so the main action comes before other actions.
 */
export const CardActions = ({
    children,
    className = "",
    inverseDirection = false,
    ...otherProps
}: CardActionsProps) => {
    return (
        <footer
            {...otherProps}
            className={
                `${eccgui}-card__actions` +
                (inverseDirection ? ` ${eccgui}-card__actions--inversedirection` : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </footer>
    );
};

export default CardActions;
