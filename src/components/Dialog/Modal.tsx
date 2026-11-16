import React from "react";
import {
    Classes as BlueprintClassNames,
    DialogProps as BlueprintDialogProps,
    Overlay2 as BlueprintOverlay,
    Overlay2Props as BlueprintOverlayProps,
} from "@blueprintjs/core";

import { preventReactFlowActionsClasses } from "../../cmem/react-flow/ReactFlow/constants";
import { utils } from "../../common";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

import { Card } from "./../Card";
import { isModalContextProvided, ModalContext } from "./ModalContext";

export interface ModalProps
    extends TestableComponent, BlueprintOverlayProps, Pick<BlueprintDialogProps, "role" | "aria-describedby"> {
    children: React.ReactNode | React.ReactNode[];
    /**
     * A space-delimited list of class names to pass along to the BlueprintJS `Overlay` element that is used to create the modal.
     */
    overlayClassName?: string;
    /**
     * Size of the modal.
     */
    size?: ModalSize;
    /**
     * Prevents that a backdrop area is displayed behind the modal elements.
     */
    preventBackdrop?: boolean;
    /**
     * Optional props for the wrapper div element inside the modal overlay.
     */
    wrapperDivProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    /**
     * Make the modal focusable, e.g. when clicking somewhere on it.
     * This is needed, e.g. when capturing key (down, up) events that should bubble to the modal's parent elements.
     */
    modalFocusable?: boolean;
    /**
     * Works only for modals inside portals (`usePortal={true}`).
     * When set to `true` then the `z-index` of the modal's portal element is recalculated, so that the modal is always shown on top of all other visible elements.
     * Use this with care!
     * Usually the normal opening sequence is enough to show the currently most important modal on top.
     * If this option is used inflationary then this could harm the visibility of other overlays.
     */
    forceTopPosition?: boolean;
    /**
     * Modal ID that should be globally unique. If a ModalContext is provided this can be used to track opening/closing of this modal.
     */
    modalId?: string;
    /**
     * Prevents that pan and zooming actions of an existing react-flow instance are triggered while this Modal is open.
     */
    preventReactFlowEvents?: boolean;
    /**
     * ID of the element that contains title or label text for this dialog.
     * If given then `aria-label` is ignored.
     * In v27 it will be enforced that `aria-label` or `aria-labelledby` is set.
     */
    "aria-labelledby"?: string;
    /**
     * Set this if there is no visible title element that is used for `aria-labelledby`.
     * Property is ignored if `aria-labelledby` is given.
     * In v27 it will be enforced that `aria-label` or `aria-labelledby` is set.
     */
    "aria-label"?: string;
}

export type ModalSize = "tiny" | "small" | "regular" | "large" | "xlarge" | "fullscreen";

/**
 * Checks if the elements referenced by `aria-labelledby` exist.
 * Invalid references are reported in the console and removed from `aria-labelledby`.
 * If none of them exists then `aria-label` is used as fallback, if it was given.
 * Changes are applied directly to the DOM element to prevent an additional re-rendering.
 * React does not touch these attributes again as long as their properties do not change.
 * Returns `false` if the modal has no accessible name, then its role need to be removed.
 */
const validateAriaLabelledby = (
    modalElement: HTMLElement,
    role: string,
    ariaLabelledby?: string,
    ariaLabel?: string,
): boolean => {
    if (!ariaLabelledby) {
        return true;
    }
    const rootNode = modalElement.getRootNode();
    // targets can also be located inside a shadow DOM
    const lookupRoot: Pick<Document, "getElementById"> =
        "getElementById" in rootNode ? (rootNode as Document | ShadowRoot) : modalElement.ownerDocument;
    const referencedIds = ariaLabelledby.split(/\s+/).filter((id) => !!id);
    const invalidIds = referencedIds.filter((id) => !lookupRoot.getElementById(id));
    const validIds = referencedIds.filter((id) => !invalidIds.includes(id));
    const hasValidTarget = validIds.length > 0;

    if (hasValidTarget) {
        // invalid references are removed, so screen readers cannot stumble over them
        if (invalidIds.length > 0) {
            modalElement.setAttribute("aria-labelledby", validIds.join(" "));
        }
        // `aria-label` is never rendered together with `aria-labelledby`, so it can only be a former fallback
        modalElement.removeAttribute("aria-label");
    } else {
        modalElement.removeAttribute("aria-labelledby");
        if (ariaLabel) {
            modalElement.setAttribute("aria-label", ariaLabel);
        }
    }

    if (invalidIds.length === 0 && hasValidTarget) {
        return true;
    }

    const invalidTargets = invalidIds.length > 0 ? invalidIds.map((id) => `#${id}`).join(", ") : `"${ariaLabelledby}"`;
    let fallbackInfo: string;
    if (hasValidTarget) {
        fallbackInfo = "They were removed, fallback to aria-label not necessary because other targets are valid.";
    } else if (ariaLabel) {
        fallbackInfo = `aria-labelledby was removed, fallback to aria-label="${ariaLabel}" was used.`;
    } else {
        fallbackInfo = `aria-labelledby was removed, fallback to aria-label not possible because it is not given, modal has no accessible name and role=${role} was removed.`;
    }
    // eslint-disable-next-line no-console
    console.warn(`aria-labelledby of modal references invalid targets: ${invalidTargets}. ${fallbackInfo}`);
    return hasValidTarget || !!ariaLabel;
};

/**
 * Displays contents on top of other elements, used to create dialogs.
 * For most situations the usage of `SimpleDialog` and `AlertDialog` should be sufficient.
 * Otherwise this element can be used to create own modal elements and edge cases for modal dialogs.
 * Then it is recommended to use the `Card` element inside.
 */
export const Modal = ({
    children,
    className = "",
    overlayClassName = "",
    size = "regular",
    canOutsideClickClose = false,
    canEscapeKeyClose = false,
    preventBackdrop = false,
    wrapperDivProps,
    modalFocusable = true,
    usePortal = true,
    forceTopPosition = false,
    onOpening,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    modalId,
    role = "dialog",
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-label": ariaLabel,
    preventReactFlowEvents = true,
    ...otherProps
}: ModalProps) => {
    const modalContext = React.useContext(ModalContext);
    const uniqueModalId = React.useRef<string>(
        modalId ?? Date.now().toString(36) + Math.random().toString(36).substring(2),
    );

    React.useEffect(() => {
        return () => {
            // Make sure to always remove flag when modal is removed
            modalContext.setModalOpen(uniqueModalId.current, false);
        };
    }, []);

    const modalElementRef = React.useRef<HTMLElement>(null);
    // prevents that the same element is validated multiple times with unchanged properties
    const lastLabelValidation = React.useRef<{ element?: HTMLElement; key?: string }>({});
    // set if none of the `aria-labelledby` targets exists and no `aria-label` is given as fallback
    const hasNoValidLabelTarget = React.useRef<boolean>(false);

    const hasLabelProperty = !!(ariaLabel || ariaLabelledby);
    // always remove the role if there is no explanation
    const modalRole = hasLabelProperty && !hasNoValidLabelTarget.current ? role : undefined;

    React.useEffect(() => {
        if (!hasLabelProperty && otherProps.isOpen) {
            // eslint-disable-next-line no-console
            console.warn(
                `role=${role} removed from modal because neither aria-label nor aria-labelledby is available.`,
            );
        }
        modalContext.setModalOpen(uniqueModalId.current, otherProps.isOpen);
    }, [otherProps.isOpen]);

    const backdropProps: React.HTMLProps<HTMLDivElement> | undefined =
        !canOutsideClickClose && canEscapeKeyClose
            ? {
                  ...otherProps.backdropProps,
                  // Escape key won't work anymore otherwise after clicking on the backdrop
                  tabIndex: 0,
              }
            : otherProps.backdropProps;

    const focusableProps = modalFocusable
        ? {
              tabIndex: 0,
          }
        : undefined;

    const alteredChildren = React.Children.map(children, (child) => {
        if ((child as React.ReactElement).type && (child as React.ReactElement).type === Card) {
            return React.cloneElement(child as React.ReactElement, {
                isOnlyLayout: true,
                elevation: 4,
            });
        }

        return child;
    });

    const handlerOnOpening = (modalElement: HTMLElement) => {
        if (onOpening) {
            // call the original event handler
            onOpening(modalElement);
        }
        // content of the modal is available now, so targets inside of it can be found
        checkLabelTargets();
        if (usePortal && forceTopPosition) {
            const parentalPortal = modalElement.closest(`.${BlueprintClassNames.PORTAL}`) as HTMLElement;
            const highestTopIndex = (utils.getGlobalVar("highestModalTopIndex") as unknown as number) ?? 0;
            if (parentalPortal) {
                const portalTopIndex = parseInt(getComputedStyle(parentalPortal).zIndex ?? 0, 10);
                const newTopIndex = Math.max(portalTopIndex, highestTopIndex) + 1;
                parentalPortal.style.zIndex = `${newTopIndex}`;
                utils.setGlobalVar("highestModalTopIndex", newTopIndex);
            }
        }
    };

    // Only the modal that was opened last constrains assistive technologies to its contents.
    // Without a provided ModalContext the modals do not know about each other, then each of them
    // has to consider itself as the one that constrains.
    const openModalStack = modalContext.openModalStack() ?? [];
    const isTopMostModal = isModalContextProvided(modalContext)
        ? openModalStack[openModalStack.length - 1] === uniqueModalId.current
        : true;

    const modalAriaAttributes = {
        role: modalRole,
        "aria-label": !ariaLabelledby ? ariaLabel : undefined,
        "aria-labelledby": ariaLabelledby,
        "aria-describedby": ariaDescribedby,
        // modality can only be expressed together with a dialog role
        "aria-modal": modalRole ? isTopMostModal : undefined,
    };

    const checkLabelTargets = () => {
        const element = modalElementRef.current;
        const key = `${ariaLabelledby}|${ariaLabel}`;
        if (!element || (lastLabelValidation.current.element === element && lastLabelValidation.current.key === key)) {
            return;
        }
        lastLabelValidation.current = { element, key };
        const hasAccessibleName = validateAriaLabelledby(element, role, ariaLabelledby, ariaLabel);
        hasNoValidLabelTarget.current = !hasAccessibleName;
        // role and modality are changed directly on the DOM element, following renderings respect the flag
        if (!hasAccessibleName) {
            element.removeAttribute("role");
            element.removeAttribute("aria-modal");
        } else if (hasLabelProperty && !element.hasAttribute("role")) {
            // restore them if they were removed by a former check
            element.setAttribute("role", role);
            element.setAttribute("aria-modal", `${isTopMostModal}`);
        }
    };

    React.useEffect(() => {
        // only for changes while the modal is open, initial check is done when it is opening
        if (otherProps.isOpen) {
            checkLabelTargets();
        }
    }, [ariaLabelledby, ariaLabel]);

    return (
        <BlueprintOverlay
            {...otherProps}
            backdropProps={backdropProps}
            className={`${overlayClassName} ${preventReactFlowEvents ? preventReactFlowActionsClasses : ""}`}
            backdropClassName={`${eccgui}-dialog__backdrop`}
            canOutsideClickClose={canOutsideClickClose}
            canEscapeKeyClose={canEscapeKeyClose}
            hasBackdrop={!preventBackdrop}
            usePortal={usePortal}
            onOpening={handlerOnOpening}
            portalClassName={`${eccgui}-dialog__portal`}
        >
            <div
                {...wrapperDivProps}
                className={BlueprintClassNames.DIALOG_CONTAINER}
                // this is a workaround because data attribute on SimpleDialog is not correctly routed to the overlay by blueprint js
                {...{ "data-test-id": dataTestId ?? "simpleDialogWidget", "data-testid": dataTestid }}
                tabIndex={0}
                {...focusableProps}
            >
                <section
                    className={
                        `${eccgui}-dialog__wrapper` +
                        (typeof size === "string" ? ` ${eccgui}-dialog__wrapper--` + size : "") +
                        (className ? " " + className : "")
                    }
                    {...modalAriaAttributes}
                    ref={modalElementRef}
                >
                    {alteredChildren}
                </section>
            </div>
        </BlueprintOverlay>
    );
};

export default Modal;
