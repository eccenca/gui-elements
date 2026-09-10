import React from "react";

import { ClassNames as IntentClassNames, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";
import Label, { LabelProps } from "../Label/Label";

export interface FieldItemProps extends React.HTMLAttributes<HTMLDivElement>, TestableComponent {
    /**
     * Intent state of the field item.
     */
    intent?: IntentTypes;
    /**
     * Is disabled.
     * The included inout element nedd to set disabled directly itself.
     * This is not routed through automatically.
     */
    disabled?: boolean;
    /**
     * Used to set properties for the `Label` element that is used.
     */
    labelProps?: LabelProps;
    /**
     * Text for user help.
     * Is displayed between label and input element.
     */
    helperText?: string | React.JSX.Element;
    /**
     * Feedback notification.
     * Is displayed below the included input element.
     */
    messageText?: string;
    /**
     * Prevent the automatic connection of the field item parts.
     * By default label, input element, helper text and message are connected to each
     * other via `for`, `aria-labelledby` and `aria-describedby`.
     * Set it to `true` if the using application manages the accessibility attributes itself.
     */
    preventAriaAttribution?: boolean;
}

/**
 * Input elements that could be connected to the label and the help texts of the field item.
 */
const connectableInputSelectors = ["input", "textarea", "select", `.${eccgui}-select button`];

/**
 * Form element that manages the combination of label, helper texts, input element and feedback messages.
 */
export const FieldItem = ({
    children,
    className,
    disabled,
    labelProps,
    helperText,
    messageText,
    intent,
    preventAriaAttribution = false,
    ...otherProps
}: FieldItemProps) => {
    const fieldItemRef = React.useRef<HTMLDivElement>(null);
    /** unique ID of this field item, used as suffix for the IDs of its parts */
    const fieldItemId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");

    const intentClass = intent ? " " + IntentClassNames[intent.toUpperCase()] : "";

    /**
     * Connect the parts of the field item to each other for accessibility reasons.
     * It is done on every update because the included input element may be replaced or added later on.
     * Already existing IDs and connections are never overwritten, they are managed by the using application then.
     * It is not done at all if `preventAriaAttribution` is set.
     */
    React.useEffect(() => {
        const fieldItem = fieldItemRef.current;
        if (!fieldItem || preventAriaAttribution) {
            return;
        }

        /** nested field items manage the connections of their own parts */
        const ownPart = <T extends HTMLElement>(candidates: NodeListOf<T>): T | undefined =>
            Array.from(candidates).find((candidate) => candidate.closest(`.${eccgui}-fielditem`) === fieldItem);

        const labelElement = ownPart(fieldItem.querySelectorAll<HTMLElement>(`.${eccgui}-fielditem__label`));
        const inputElement = ownPart(
            fieldItem.querySelectorAll<HTMLElement>(
                connectableInputSelectors.map((selector) => `.${eccgui}-fielditem__inputfields ${selector}`).join(", "),
            ),
        );
        const helpElement = ownPart(fieldItem.querySelectorAll<HTMLElement>(`.${eccgui}-fielditem__helpertext`));
        const messageElement = ownPart(fieldItem.querySelectorAll<HTMLElement>(`.${eccgui}-fielditem__message`));

        const setMissingId = (element: HTMLElement | undefined, id: string) => {
            if (element && !element.id) {
                element.id = id;
            }
        };
        setMissingId(labelElement, `label_${fieldItemId}`);
        setMissingId(inputElement, `input_${fieldItemId}`);
        setMissingId(helpElement, `help_${fieldItemId}`);
        setMissingId(messageElement, `message_${fieldItemId}`);

        if (!inputElement) {
            return;
        }

        if (labelElement) {
            if (labelElement instanceof HTMLLabelElement) {
                if (!labelElement.getAttribute("for")) {
                    labelElement.setAttribute("for", inputElement.id);
                }
            } else if (!inputElement.getAttribute("aria-labelledby")) {
                // labels that are not `label` elements, e.g. of disabled field items, cannot use `for`
                inputElement.setAttribute("aria-labelledby", labelElement.id);
            }
        }

        const describedBy = (inputElement.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
        [messageElement, helpElement].forEach((element) => {
            if (element && !describedBy.includes(element.id)) {
                describedBy.push(element.id);
            }
        });
        if (describedBy.length > 0) {
            inputElement.setAttribute("aria-describedby", describedBy.join(" "));
        }
    });

    const label = (
        <Label
            {...labelProps}
            className={`${eccgui}-fielditem__label` + (labelProps?.className ? " " + labelProps.className : "")}
            disabled={disabled}
        />
    );

    const userhelp =
        helperText &&
        (typeof helperText === "string" ? (
            <p className={`${eccgui}-fielditem__helpertext`}>{helperText}</p>
        ) : (
            <div className={`${eccgui}-fielditem__helpertext`}>{helperText}</div>
        ));

    const inputfields = children && <div className={`${eccgui}-fielditem__inputfields`}>{children}</div>;

    const notification =
        messageText &&
        (typeof messageText === "string" ? (
            <p className={`${eccgui}-fielditem__message` + intentClass}>{messageText}</p>
        ) : (
            <div className={`${eccgui}-fielditem__message` + intentClass}>{messageText}</div>
        ));

    return (
        <div
            ref={fieldItemRef}
            className={
                `${eccgui}-fielditem` +
                (className ? " " + className : "") +
                (disabled ? ` ${eccgui}-fielditem--disabled` : "")
            }
            {...otherProps}
        >
            {label}
            {userhelp}
            {inputfields}
            {notification}
        </div>
    );
};

export default FieldItem;
