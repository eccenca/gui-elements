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
    'input:not([type="hidden"])',
    "textarea",
    "select",
    `.${eccgui}-select[role="combobox"]`,
    `.${eccgui}-select:not([role="combobox"]) button`,
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
    const connectedInputRef = React.useRef<HTMLElement | undefined>(undefined);
    /** label ID that was added to `aria-labelledby` by the field item itself, it may be set by the application */
    const labelledByRef = React.useRef<{ element: HTMLElement; id: string } | undefined>(undefined);
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
        const ownParts = <T extends HTMLElement>(candidates: NodeListOf<T>): T[] =>
            Array.from(candidates).filter((candidate) => candidate.closest(`.${eccgui}-fielditem`) === fieldItem);
        const ownPart = <T extends HTMLElement>(candidates: NodeListOf<T>): T | undefined => ownParts(candidates)[0];

        const labelElement = ownPart(fieldItem.querySelectorAll<HTMLElement>(`.${eccgui}-fielditem__label`));
        const inputElements = ownParts(
            fieldItem.querySelectorAll<HTMLElement>(
                connectableInputSelectors.map((selector) => `.${eccgui}-fielditem__inputfields ${selector}`).join(", "),
            ),
        );
        // an explicit `for` of the label selects the connected input element, otherwise the first one is used
        const labelTarget = labelElement instanceof HTMLLabelElement ? labelElement.getAttribute("for") : null;
        const inputElement =
            inputElements.find((element) => labelTarget && element.id === labelTarget) ?? inputElements[0];
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

        /**
         * Update a list of ID references, only the IDs created by this field item are removed if their part is gone.
         * References set by the using application always stay untouched.
         */
        const updateReferences = (
            element: HTMLElement,
            attribute: string,
            parts: [HTMLElement | undefined, string][],
        ) => {
            const references = (element.getAttribute(attribute) ?? "").split(" ").filter(Boolean);
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
                element.setAttribute(attribute, references.join(" "));
            } else {
                element.removeAttribute(attribute);
            }
        };

        const previousInput = connectedInputRef.current;
        if (previousInput && previousInput !== inputElement) {
            if (previousInput.id === `input_${fieldItemId}`) {
                previousInput.removeAttribute("id");
            }
            updateReferences(previousInput, "aria-labelledby", [[undefined, `label_${fieldItemId}`]]);
            updateReferences(previousInput, "aria-describedby", [
                [undefined, `message_${fieldItemId}`],
                [undefined, `help_${fieldItemId}`],
            ]);
        }
        connectedInputRef.current = inputElement;

        // remove the label ID added before if that label is not connected to that input element anymore
        const labelledBy = labelledByRef.current;
        if (labelledBy && (labelledBy.element !== inputElement || labelledBy.id !== labelElement?.id)) {
            updateReferences(labelledBy.element, "aria-labelledby", [[undefined, labelledBy.id]]);
            labelledByRef.current = undefined;
        }

        if (!inputElement) {
            return;
        }

        const connectsNatively =
            labelElement instanceof HTMLLabelElement && labelableElements.includes(inputElement.tagName);

        if (connectsNatively) {
            // a `for` that does not refer to an input element of this field item is replaced
            if (labelTarget !== inputElement.id) {
                labelElement.setAttribute("for", inputElement.id);
            }
        } else if (labelElement instanceof HTMLLabelElement) {
            // labels that are not `label` elements, e.g. of disabled field items, cannot use `for`
            // the same is true for input elements that cannot be referenced by `for`
            labelElement.removeAttribute("for");
        }

        if (labelElement) {
            /** references of the using application, without the label ID added by the field item itself */
            const ownLabelId = labelledByRef.current?.id;
            const applicationReferences = (inputElement.getAttribute("aria-labelledby") ?? "")
                .split(" ")
                .filter((id) => id && id !== ownLabelId);
            /**
             * A native connection via `for` is overruled by an `aria-labelledby` of the application,
             * so the label ID is put in front of those references then.
             * Otherwise `aria-labelledby` is only set if the application does not manage it itself.
             */
            const addLabelId = connectsNatively
                ? applicationReferences.length > 0 && !applicationReferences.includes(labelElement.id)
                : applicationReferences.length === 0;
            if (addLabelId) {
                inputElement.setAttribute("aria-labelledby", [labelElement.id, ...applicationReferences].join(" "));
                labelledByRef.current = { element: inputElement, id: labelElement.id };
            } else if (ownLabelId) {
                updateReferences(inputElement, "aria-labelledby", [[undefined, ownLabelId]]);
                labelledByRef.current = undefined;
            }
        } else {
            updateReferences(inputElement, "aria-labelledby", [[undefined, `label_${fieldItemId}`]]);
        }

        const descriptions: [HTMLElement | undefined, string][] = [
            [messageElement, `message_${fieldItemId}`],
            [helpElement, `help_${fieldItemId}`],
        ];
        updateReferences(inputElement, "aria-describedby", descriptions);
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

    const handleLabelClick: React.MouseEventHandler<HTMLLabelElement> = (event) => {
        labelProps?.onClick?.(event);
        if (event.defaultPrevented || disabled || preventAriaAttribution) {
            return;
        }
        const labelElement = event.currentTarget;
        if (labelElement instanceof HTMLLabelElement && labelElement.control) {
            return;
        }
        if (!(event.target instanceof Node) || !labelElement.contains(event.target)) {
            return;
        }
        const interactiveTarget =
            event.target instanceof Element
                ? event.target.closest(
                      "a[href], button, input, select, textarea, summary, [tabindex], [contenteditable=true], [role=button], [role=link]",
                  )
                : null;
        if (interactiveTarget && labelElement.contains(interactiveTarget)) {
            return;
        }
        const control = connectedInputRef.current;
        if (control && !control.matches(':disabled, [aria-disabled="true"], [contenteditable="false"]')) {
            control.focus();
        }
    };

    const label = (
        <Label
            {...labelProps}
            onClick={handleLabelClick}
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
