import React from "react";
import { cva } from "class-variance-authority";

import { intentClassName, IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";
import Icon, { IconProps } from "@/components/atoms/Icon/Icon";
import { TestIconProps } from "@/components/atoms/Icon/TestIcon";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

type NotificationIntent = Extract<IntentTypes, "neutral" | "success" | "warning" | "danger" | "info">;

export interface NotificationProps extends TestableComponent, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Extra user action elements
     */
    actions?: React.JSX.Element | React.JSX.Element[];
    /**
     * Notification message that can be used as alternative to children elements.
     */
    message?: React.JSX.Element | string;
    /**
     * Intent state of the notification.
     */
    intent?: NotificationIntent;
    /**
     * Notification uses the the given space more flexible.
     * Default notification is displayed in min and max limits.
     * Those limits are removed by setting this property to `true`.
     */
    flexWidth?: boolean;
    /**
     * Icon displayed with the notification.
     * Set it to false if you need to prevent automatically set icon regarding the notification type.
     */
    icon?: false | React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
    /**
     * Callback invoked when the notification is dismissed, either by the user (argument is `false`)
     * or because the `timeout` expired (argument is `true`).
     */
    onDismiss?: (didTimeoutExpire: boolean) => void;
    /**
     * Milliseconds to wait before automatically dismissing the notification.
     * Providing a value less than or equal to `0` disables the timeout (the default).
     * The auto-dismiss is paused while the pointer hovers the notification.
     */
    timeout?: number;
    /**
     * Whether to show the close button.
     * The close button is only rendered when an `onDismiss` handler is set.
     *
     * @default true
     */
    isCloseButtonShown?: boolean;
    /**
     * If set then a `div` element is used as wrapper.
     * It uses the attributes given via this property.
     */
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Div-based inline alert recipe (shadcn/ui `alert` style) driving the notification's look.
 * The border, soft tinted background and icon color are keyed on the intent axis via the
 * library's semantic Intent tokens (`--color-info|success|warning|destructive`); body text stays
 * `text-foreground` for every intent, only the border/background tint and the icon change.
 */
const notificationVariants = cva(
    "relative flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-sm text-foreground",
    {
        variants: {
            intent: {
                neutral: "border-border bg-card",
                info: "border-info/30 bg-info/5",
                success: "border-success/30 bg-success/5",
                warning: "border-warning/30 bg-warning/5",
                danger: "border-destructive/30 bg-destructive/5",
            },
        },
        defaultVariants: {
            intent: "info",
        },
    },
);

/** Icon tint per intent (Lucide/Carbon icons paint with `currentColor`). */
const notificationIconColor: Record<NotificationIntent, string> = {
    neutral: "text-foreground",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
};

/**
 * Displays a notification message, optionally combined with depiction and further action buttons.
 * By default it uses colorization of an blueish info alert.
 */
export const Notification = ({
    actions,
    children,
    className,
    message,
    flexWidth = false,
    icon,
    timeout,
    onDismiss,
    isCloseButtonShown = true,
    wrapperProps,
    onMouseEnter,
    onMouseLeave,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    intent = "info",
    ...otherProps
}: NotificationProps) => {
    // Auto-dismiss timeout. `onDismiss` is read through a ref so that changing its identity between
    // renders (inline arrow handlers are common) does not restart the timer on every render.
    const onDismissRef = React.useRef(onDismiss);
    React.useEffect(() => {
        onDismissRef.current = onDismiss;
    }, [onDismiss]);

    const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const clearDismissTimeout = React.useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = undefined;
        }
    }, []);
    const startDismissTimeout = React.useCallback(() => {
        clearDismissTimeout();
        if (timeout && timeout > 0) {
            timeoutIdRef.current = setTimeout(() => onDismissRef.current?.(true), timeout);
        }
    }, [timeout, clearDismissTimeout]);
    React.useEffect(() => {
        startDismissTimeout();
        return clearDismissTimeout;
    }, [startDismissTimeout, clearDismissTimeout]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        clearDismissTimeout();
        onMouseEnter?.(event);
    };
    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        startDismissTimeout();
        onMouseLeave?.(event);
    };

    const intentIconSymbol = intent !== "neutral" ? `state-${intent}` : false;

    let notificationIcon = icon !== false ? icon : undefined;
    if (icon !== false && !notificationIcon && !!intentIconSymbol) {
        notificationIcon = <Icon name={intentIconSymbol as ValidIconName} small />;
    }

    const content = actions ? (
        <div className={cn(`${eccgui}-notification__content`, "flex items-baseline justify-between gap-2")}>
            <div className={cn(`${eccgui}-notification__messagebody`, "min-w-0 flex-1")}>
                {message ? message : children}
            </div>
            <div className={cn(`${eccgui}-notification__actions`, "flex flex-shrink-0 flex-wrap items-center gap-2")}>
                {actions}
            </div>
        </div>
    ) : message ? (
        message
    ) : (
        children
    );

    const notification = (
        <div
            className={cn(
                notificationVariants({ intent }),
                `${eccgui}-notification`,
                intentClassName(intent),
                flexWidth && `${eccgui}-notification--flexwidth`,
                flexWidth && "min-w-0 max-w-none",
                !onDismiss && `${eccgui}-notification--static`,
                className,
            )}
            role="alert"
            {...otherProps}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {notificationIcon ? (
                <span
                    className={cn(`${eccgui}-notification__icon`, "flex-shrink-0", notificationIconColor[intent])}
                    aria-hidden={true}
                >
                    {notificationIcon}
                </span>
            ) : null}
            <div className={cn(`${eccgui}-notification__message`, "min-w-0 flex-1")}>{content}</div>
            {onDismiss && isCloseButtonShown ? (
                <button
                    type="button"
                    aria-label="Close"
                    className={cn(
                        `${eccgui}-notification__dismiss`,
                        "-mr-1 -mt-0.5 ml-auto inline-flex flex-shrink-0 items-center justify-center rounded-md border border-transparent p-1 text-current opacity-60 transition-opacity outline-none hover:opacity-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    )}
                    onClick={() => onDismiss(false)}
                    data-test-id={dataTestId ? `${dataTestId}-dismiss-btn` : undefined}
                >
                    <Icon name="navigation-close" small />
                </button>
            ) : null}
        </div>
    );

    return wrapperProps || dataTestId || dataTestid ? (
        <div
            className={`${eccgui}-notification__wrapper`}
            {...(wrapperProps ?? {})}
            {...{ "data-test-id": dataTestId, "data-testid": dataTestid }}
        >
            {notification}
        </div>
    ) : (
        <>{notification}</>
    );
};

export default Notification;
