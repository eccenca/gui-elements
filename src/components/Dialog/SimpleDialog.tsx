import React, { BaseSyntheticEvent } from "react";

import { IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import IconButton from "../Icon/IconButton";
import { TestableComponent } from "../interfaces";

import { Card, CardActions, CardActionsProps, CardContent, CardHeader, CardOptions, CardTitle } from "./../Card";
import Divider from "./../Separation/Divider";
import Modal, { ModalProps } from "./Modal";

/**
 * Per-intent Card surface wash + CardTitle text color, driven by the dialog's `intent` prop. These
 * replace the former `card.scss` `.eccgui-card.eccgui-intent--*` / `.eccgui-card__title.eccgui-intent--*`
 * rules (the intent value is only known here at the call site). `primary`/`accent` map onto the single
 * `--primary` token; `danger` onto `--destructive`; `warning` uses a slightly stronger wash.
 *
 * Expressed as `color-mix(..., var(--card))` rather than a plain translucent `bg-<intent>/N`: `Card`'s
 * own recipe already sets `bg-card` (see `Card.tsx`), and `cn()`/tailwind-merge collapses conflicting
 * `bg-*` utilities to the last one — a plain `bg-warning/15` would therefore *replace* `bg-card`
 * outright (not layer on top of it), leaving the dialog surface a translucent tint over whatever sits
 * behind the modal (its backdrop) instead of an opaque, softly-tinted card. Mixing the intent color
 * into `var(--card)` directly keeps the result an opaque solid (matching the legacy solid-pastel
 * look) and still reads as the intended soft (10–15%) wash, in both light and dark mode.
 */
const cardIntentClassName: Record<IntentTypes, string> = {
    none: "",
    neutral: "",
    primary: "bg-[color-mix(in_oklab,var(--primary)_10%,var(--card))]",
    accent: "bg-[color-mix(in_oklab,var(--primary)_10%,var(--card))]",
    info: "bg-[color-mix(in_oklab,var(--info)_10%,var(--card))]",
    success: "bg-[color-mix(in_oklab,var(--success)_10%,var(--card))]",
    warning: "bg-[color-mix(in_oklab,var(--warning)_15%,var(--card))]",
    danger: "bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))]",
};
const titleIntentClassName: Record<IntentTypes, string> = {
    none: "",
    neutral: "",
    primary: "text-primary",
    accent: "text-primary",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
};

export interface SimpleDialogProps extends ModalProps, TestableComponent {
    /**
     * The title of the dialog.
     */
    title?: string;
    /**
     * Parts of the dialog are separated by a horizontal ruler.
     */
    hasBorder?: boolean;
    /**
     * Include elements to the action footer, e.g. buttons.
     */
    actions?: React.ReactNode | React.ReactNode[];
    /**
     * If populated with elements, then a second contant area is included before the action footer.
     * Mainly provided to include `Notification` elements.
     */
    notifications?: React.ReactNode | React.ReactNode[];
    /**
     * Can contain elements actionable/non-actionable elements display right-aligned to the dialog title.
     */
    headerOptions?: null | React.JSX.Element | React.JSX.Element[];
    /**
     * If enabled neither closing via `esc` key or clicking outside of the component will work, except explicitly specified.
     */
    preventSimpleClosing?: boolean;
    /**
     * Define purpose of the dialog, e.g. if it is a warning.
     */
    intent?: IntentTypes;
    /** Optional props for the wrapper div element inside the modal. */
    wrapperDivProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    /** If a full screen toggler is shown that will allow to switch to full screen mode. */
    showFullScreenToggler?: boolean;
    /** Starts the modal in full screen mode. The show full screen toggler will be automatically enabled. */
    startInFullScreenMode?: boolean;
    /** Forward properties to the actions footer component. */
    actionsProps?: Omit<CardActionsProps, "inverseDirection">;
}

/**
 * Simplifies the dialog display by providing a direct `Card` template for the `Modal` element.
 * Inherits all properties from `Modal`.
 */
export const SimpleDialog = ({
    children,
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    title = "",
    actions = null,
    notifications = null,
    hasBorder = false,
    preventSimpleClosing = false,
    enforceFocus = false,
    intent,
    headerOptions,
    showFullScreenToggler = false,
    startInFullScreenMode = false,
    size,
    actionsProps,
    ...otherProps
}: SimpleDialogProps) => {
    const [displayFullscreen, setDisplayFullscreen] = React.useState<boolean>(startInFullScreenMode);
    const showToggler = startInFullScreenMode || showFullScreenToggler;
    const intentClassName = intent ? `${eccgui}-intent--${intent}` : "";
    // Tailwind tints for the intent (see the maps above); the legacy `eccgui-intent--*` class stays too.
    const cardIntentTint = intent ? cardIntentClassName[intent] : "";
    const titleIntentTint = intent ? titleIntentClassName[intent] : "";
    const wrapperDivProps = {
        ...modalPreventEvents,
        ...otherProps.wrapperDivProps,
    };
    return (
        <Modal
            enforceFocus={enforceFocus}
            {...otherProps}
            wrapperDivProps={wrapperDivProps}
            // set default test id if not given
            data-test-id={otherProps["data-test-id"] ?? "simpleDialogWidget"}
            canOutsideClickClose={canOutsideClickClose || !preventSimpleClosing}
            canEscapeKeyClose={canEscapeKeyClose || !preventSimpleClosing}
            size={displayFullscreen ? "fullscreen" : size}
        >
            <Card className={cn(intentClassName, cardIntentTint)}>
                {title || headerOptions || showToggler ? (
                    <CardHeader>
                        <CardTitle className={cn(intentClassName, titleIntentTint)}>{title}</CardTitle>
                        {headerOptions || showToggler ? (
                            <CardOptions>
                                {headerOptions}
                                {showToggler && (
                                    <IconButton
                                        name={displayFullscreen ? "toggler-minimize" : "toggler-maximize"}
                                        onClick={() => setDisplayFullscreen(!displayFullscreen)}
                                    />
                                )}
                            </CardOptions>
                        ) : (
                            <></>
                        )}
                    </CardHeader>
                ) : null}
                {hasBorder && <Divider />}
                {/* `pt-3.5` (= card spacing) restores the top padding a CardContent loses when it is
                    rendered directly after a Divider instead of as the card's first child */}
                <CardContent className={cn(hasBorder && "pt-3.5")}>{children}</CardContent>
                {hasBorder && <Divider />}
                {!!notifications && (
                    <CardContent
                        className={cn(`${eccgui}-dialog__notifications`, "shrink-0 grow-0", hasBorder && "pt-3.5")}
                    >
                        {notifications}
                    </CardContent>
                )}
                {actions && (
                    <CardActions
                        {...actionsProps}
                        inverseDirection
                        className={`${actionsProps?.className ?? ""} ${intentClassName}`}
                    >
                        {actions}
                    </CardActions>
                )}
            </Card>
        </Modal>
    );
};

/** Events that should be prevented to bubble up from a modal that goes beyond the most simple version of a modal, e.g.
 * allows to drag or supports hot keys etc. */
export const modalPreventEvents = {
    // Prevent certain events from leaving the modal, so that e.g. react-flow does not receive these events doing unexpected stuff
    onContextMenu: (event: BaseSyntheticEvent) => event.stopPropagation(),
    onDrag: (event: BaseSyntheticEvent) => event.stopPropagation(),
    onDragStart: (event: BaseSyntheticEvent) => event.stopPropagation(),
    onDragEnd: (event: BaseSyntheticEvent) => event.stopPropagation(),
    // The following prevents some drop-downs to not close anymore when clicking outside of them
    // onMouseDown: (event: BaseSyntheticEvent) => event.stopPropagation(),
    onMouseUp: (event: BaseSyntheticEvent) => event.stopPropagation(),
    onClick: (event: BaseSyntheticEvent) => event.stopPropagation(),
};

export default SimpleDialog;
