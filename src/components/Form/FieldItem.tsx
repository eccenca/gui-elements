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
     * By default, label, input element, helper text and message are connected to each
     * other via `for`, `aria-labelledby` and `aria-describedby`.
     * Set it to `true` if the using application manages the accessibility attributes itself.
     */
    preventAriaAttribution?: boolean;
}

/**
 * Input elements that could be connected to the label and the help texts of the field item.
 */
const connectableInputSelectors = [
    "input",
    "textarea",
    "select",
    `.${eccgui}-select button`,
    `.${eccgui}-codeeditor .cm-content`,
];

/**
 * Elements that can be referenced by the `for` attribute of a `label` element.
 * Other input elements, e.g. the editable area of the code editor, need to use `aria-labelledby`.
 */
const labelableElements = ["BUTTON", "INPUT", "METER", "OUTPUT", "PROGRESS", "SELECT", "TEXTAREA"];

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
     * It is done on every update and DOM change because the parts may be replaced, added or removed later on.
     * Already existing IDs and connections are never overwritten, they are managed by the using application then.
     * Only the ID references created by the field item itself are removed again if their part does not exist anymore.
     * It is not done at all if `preventAriaAttribution` is set.
     */
    const connectParts = React.useCallback(() => {
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

        /**
         * Update a list of ID references, only the IDs created by this field item are removed if their part is gone.
         * References set by the using application always stay untouched.
         */
        const updateReferences = (attribute: string, parts: [HTMLElement | undefined, string][]) => {
            const references = (inputElement.getAttribute(attribute) ?? "").split(" ").filter(Boolean);
            parts.forEach(([element, ownId]) => {
                if (element) {
                    if (!references.includes(element.id)) {
                        references.push(element.id);
                    }
                } else if (references.includes(ownId)) {
                    references.splice(references.indexOf(ownId), 1);
                }
            });
            if (references.length > 0) {
                inputElement.setAttribute(attribute, references.join(" "));
            } else {
                inputElement.removeAttribute(attribute);
            }
        };

        if (labelElement instanceof HTMLLabelElement && labelableElements.includes(inputElement.tagName)) {
            // an already set `for` is only kept if it refers to the ID of the input element of this field item
            if (labelElement.getAttribute("for") !== inputElement.id) {
                labelElement.setAttribute("for", inputElement.id);
            }
        } else if (labelElement) {
            // labels that are not `label` elements, e.g. of disabled field items, cannot use `for`
            // the same is true for input elements that cannot be referenced by `for`
            if (!inputElement.getAttribute("aria-labelledby")) {
                inputElement.setAttribute("aria-labelledby", labelElement.id);
            }
        } else {
            updateReferences("aria-labelledby", [[undefined, `label_${fieldItemId}`]]);
        }

        updateReferences("aria-describedby", [
            [messageElement, `message_${fieldItemId}`],
            [helpElement, `help_${fieldItemId}`],
        ]);
    }, [fieldItemId, preventAriaAttribution]);

    React.useEffect(() => {
        connectParts();
    });

    /**
     * Some parts are created after the field item was mounted, e.g. the editable area of the code editor,
     * and such changes do not trigger an update of the field item itself.
     */
    React.useEffect(() => {
        const fieldItem = fieldItemRef.current;
        if (!fieldItem || preventAriaAttribution) {
            return;
        }
        const partsObserver = new MutationObserver(connectParts);
        partsObserver.observe(fieldItem, { childList: true, subtree: true });
        return () => partsObserver.disconnect();
    }, [connectParts, preventAriaAttribution]);

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
