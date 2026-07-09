import React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {
    Badge,
    Button,
    Card,
    CardActions,
    CardActionsAux,
    CardContent,
    CardHeader,
    CardOptions,
    CardTitle,
    DecoupledOverlay,
    IconButton,
    Markdown,
    ModalSize,
    SimpleDialog,
    Spacing,
    TooltipSize,
} from "../../index";

export interface VisualTourProps {
    /** The steps of the tour. */
    steps: VisualTourStep[];
    /** Called when the tour is cancelled or closed at then end. This should usually remove the component from the outside. */
    onClose: () => void;
    /** Label of the button to close the tour. */
    closeLabel?: string;
    /** The label for the 'next' button. */
    nextLabel?: string;
    /** The label for the 'previous' button. */
    prevLabel?: string;
    /** The step target is usable, e.g. it can be clicked. */
    usableStepTarget?: boolean;
    /** Need to be set to `true` that the tour is displayed. */
    isOpen?: boolean;
}

export interface VisualTourStep {
    title: string;
    /** The description or more elaborate content element that is shown in the modal/overlay. */
    content: string | (() => React.JSX.Element);
    /** Optional element that should be highlighted. The step content is displayed as a tooltip instead of a modal.
     * In case of an array, the first match is highlighted. */
    highlightElementQuery?: string | string[];
    /** The texts used in the step, e.g. when custom layouts are rendered, these will be used for the text strings. */
    texts?: Record<string, string>;
    /** An image URL. This will be displayed in the step description. */
    image?: string;
    /** The size of the tooltip or modal. */
    size?: TooltipSize | ModalSize;
    /** The step target is usable, e.g. it can be clicked. Overwrites the setting in `<VisualTour/>`. */
    usableStepTarget?: boolean;
}

/** This should be used for defining steps in a separate object/file. Use with 'satisfies' after the object definition. */
export type VisualTourStepDefinitions = Record<string, Partial<VisualTourStep>>;

const highlightElementBaseClass = `${eccgui}-visual-tour__highlighted-element`;
const highlightElementUseableClass = `${highlightElementBaseClass}--useable`;

/**
 * Former `.eccgui-visual-tour__highlighted-element--useable { position: relative; z-index: 999999
 * !important }` (visualTour.scss): lifts the highlighted target above the tour's own dimming
 * chrome so it stays clickable/visible through the "hole". The highlighted element is an
 * arbitrary node somewhere in the consuming application (found via `document.querySelector`), not
 * one of this library's own components, so there is no `className` prop of ours to attach a
 * Tailwind class to - the effect is applied as a plain inline style directly on that element
 * instead. The `--useable` classname itself is still added/removed unchanged on the same element,
 * kept for any external CSS that keys off it.
 */
const applyUseableHighlightStyle = (element: HTMLElement) => {
    element.style.setProperty("position", "relative");
    element.style.setProperty("z-index", "999999", "important");
};

const clearUseableHighlightStyle = (element: HTMLElement | null | undefined) => {
    element?.style.removeProperty("position");
    element?.style.removeProperty("z-index");
};

/** A visual tour multi-step tour of the current view. */
export const VisualTour = ({
    steps,
    onClose,
    closeLabel = "Close",
    nextLabel = "Next",
    prevLabel = "Back",
    usableStepTarget = false,
    isOpen = false,
}: VisualTourProps) => {
    const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
    const [currentStepComponent, setCurrentStepComponent] = React.useState<React.JSX.Element | null>(null);

    React.useEffect(() => {
        const closeTour = () => {
            // clear observer and disconnect
            if (lastObserver) {
                lastObserver.takeRecords();
                lastObserver.disconnect();
            }
            // empty step
            setCurrentStepComponent(null);
            // remove highlight classes (+ the inline style the useable variant applied)
            document.querySelector(`.${highlightElementBaseClass}`)?.classList.remove(highlightElementBaseClass);
            const useableElement = document.querySelector(`.${highlightElementUseableClass}`);
            useableElement?.classList.remove(highlightElementUseableClass);
            clearUseableHighlightStyle(useableElement as HTMLElement | null);
            // call callback function from outside
            onClose();
        };

        const step = steps[currentStepIndex];
        if (!step) {
            // This should not happen
            closeTour();
            return;
        }
        const isUseableTarget = (
            typeof step["usableStepTarget"] === "undefined" ? usableStepTarget : step["usableStepTarget"]
        );
        const highlightElementClass = isUseableTarget ? highlightElementUseableClass : highlightElementBaseClass;
        const hasNextStep = currentStepIndex + 1 < steps.length;
        const hasPreviousStep = currentStepIndex > 0;
        // Configure optional highlighting
        let elementToHighlight: HTMLElement | null = null;
        let lastObserver: MutationObserver | null = null;
        const setStepComponent = () => {
            const stepDisplay = (
                <Badge tagProps={{ emphasis: "weaker" }} size="large">
                    {` ${currentStepIndex + 1}/${steps.length} `}
                </Badge>
            );
            const closeButton = <IconButton name="navigation-close" text={closeLabel} onClick={closeTour} />;
            const titleOptions = (
                <>
                    {stepDisplay}
                    {closeButton}
                </>
            );
            const actionButtons = [
                hasNextStep ? (
                    <Button
                        key={"next"}
                        variant="outlined"
                        elevated
                        onClick={() => {
                            setCurrentStepIndex(currentStepIndex + 1);
                        }}
                        rightIcon={"navigation-next"}
                    >
                        {nextLabel}: {steps[currentStepIndex + 1].title}
                    </Button>
                ) : (
                    <Button
                        key={"close"}
                        text={closeLabel}
                        onClick={closeTour}
                        variant="outlined"
                        elevated
                        rightIcon={"navigation-close"}
                    />
                ),
                hasPreviousStep ? (
                    <CardActionsAux>
                        <Button
                            key={"prev"}
                            variant="outlined"
                            onClick={() => {
                                setCurrentStepIndex(currentStepIndex - 1);
                            }}
                            icon={"navigation-previous"}
                        >
                            {prevLabel}
                        </Button>
                    </CardActionsAux>
                ) : null,
            ];
            // TODO: What to do if an element should have been highlighted, but none was found?
            if (elementToHighlight) {
                setCurrentStepComponent(
                    <StepPopover
                        highlightedElement={elementToHighlight}
                        titleOption={titleOptions}
                        actionButtons={actionButtons}
                        step={step}
                    />,
                );
            } else {
                setCurrentStepComponent(
                    <StepModal
                        titleOption={titleOptions}
                        actionButtons={actionButtons}
                        step={step}
                        onClose={closeTour}
                    />,
                );
            }
        };
        const addElementHighlighting = () => {
            if (step.highlightElementQuery) {
                const queries: string[] =
                    typeof step.highlightElementQuery === "string"
                        ? [step.highlightElementQuery]
                        : step.highlightElementQuery;
                queries.forEach((query) => {
                    if (elementToHighlight == null) {
                        elementToHighlight = document.querySelector(query);
                    }
                });
            } else {
                elementToHighlight = null;
            }
            if (elementToHighlight) {
                // Typescript for some reason incorrectly infers the type of elementToHighlight as never
                (elementToHighlight as HTMLElement).classList.add(highlightElementClass);
                if (isUseableTarget) {
                    applyUseableHighlightStyle(elementToHighlight as HTMLElement);
                }
                (elementToHighlight as HTMLElement).scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                if (lastObserver) {
                    lastObserver.disconnect();
                }
                lastObserver = new MutationObserver(function () {
                    // Re-new element highlighting
                    if (step.highlightElementQuery) {
                        if (!document.body.contains(elementToHighlight)) {
                            // Element has been removed or replaced
                            elementToHighlight = null;
                            addElementHighlighting();
                        } else if (!elementToHighlight?.classList.contains(highlightElementClass)) {
                            // Only the classes have been removed
                            elementToHighlight?.classList.add(highlightElementClass);
                            if (isUseableTarget) {
                                applyUseableHighlightStyle(elementToHighlight as HTMLElement);
                            }
                        }
                    }
                });
                lastObserver.observe(document.body, { childList: true, subtree: true });
            }
            setStepComponent();
        };
        addElementHighlighting();
        return () => {
            // Remove previous element highlight (+ the inline style the useable variant applied)
            const highlighted = document.querySelector(`.${highlightElementClass}`);
            highlighted?.classList.remove(highlightElementClass);
            if (isUseableTarget) {
                clearUseableHighlightStyle(highlighted as HTMLElement | null);
            }
            if (lastObserver) {
                lastObserver.disconnect();
            }
        };
    }, [currentStepIndex, usableStepTarget]);

    if (isOpen === false) {
        return null;
    } else {
        return currentStepComponent;
    }
};

interface StepModalProps {
    step: VisualTourStep;
    // Current step starting with 1
    titleOption: React.JSX.Element;
    // Close the visual tour
    onClose: () => void;
    // The navigation buttons
    actionButtons: (React.JSX.Element | null)[];
}

// Main content of a step
const StepContent = ({ step }: { step: VisualTourStep }) => {
    return (
        <>
            {step.image && (
                <>
                    {/* former `.eccgui-card__content img` rule scoped to the tour dialog/overlay
                        (visualTour.scss): center the image and cap its height so it never
                        dominates the step's card/dialog. */}
                    <img src={step.image} className="mx-auto block h-auto max-h-[40vh] w-auto max-w-full" />
                    <Spacing size="small" />
                </>
            )}
            {typeof step.content === "string" ? <Markdown>{step.content}</Markdown> : step.content()}
        </>
    );
};

/** Modal that is displayed for a step. */
const StepModal = ({ step, titleOption, onClose, actionButtons }: StepModalProps) => {
    return (
        <SimpleDialog
            title={step.title}
            headerOptions={titleOption}
            isOpen={true}
            preventSimpleClosing={true}
            onClose={onClose}
            actions={actionButtons}
            size={step.size === "medium" ? "regular" : (step.size ?? "regular")}
            overlayClassName={`${eccgui}-visual-tour__dialog`}
        >
            <StepContent step={step} />
        </SimpleDialog>
    );
};

interface StepPopoverProps {
    highlightedElement: Element;
    step: VisualTourStep;
    // Current step starting with 1
    titleOption: React.JSX.Element;
    // The navigation buttons
    actionButtons: (React.JSX.Element | null)[];
}

/** Popover that is displayed and points at the highlighted element. */
const StepPopover = ({ highlightedElement, step, titleOption, actionButtons }: StepPopoverProps) => {
    const backdropRef = React.useCallback(
        (backdrop: HTMLDivElement | null) => {
            const highlightStencil = () => {
                const targetRect = highlightedElement.getBoundingClientRect();
                backdrop!.style.left = `calc(${
                    targetRect.left + window.scrollX + "px"
                } - var(--${eccgui}-visual-tour-focus-padding))`;
                backdrop!.style.top = `calc(${
                    targetRect.top + window.scrollY + "px"
                } - var(--${eccgui}-visual-tour-focus-padding))`;
                backdrop!.style.width = `calc(${
                    targetRect.width + "px"
                } + 2 * var(--${eccgui}-visual-tour-focus-padding))`;
                backdrop!.style.height = `calc(${
                    targetRect.height + "px"
                } + 2 * var(--${eccgui}-visual-tour-focus-padding))`;
            };
            if (backdrop) {
                highlightStencil();
                window.addEventListener("resize", highlightStencil);
                return () => {
                    window.removeEventListener("resize", highlightStencil);
                };
            }
            return;
        },
        [highlightedElement],
    );

    // map to only tooltip size because the `DecoupledOverlay` only supports them
    let overlaySize: TooltipSize = "large";
    switch (step.size) {
        case "tiny":
            overlaySize = "small";
            break;
        case "regular":
            overlaySize = "medium";
            break;
        case "xlarge":
        case "fullscreen":
            overlaySize = "large";
            break;
    }

    return createPortal(
        // former `.eccgui-visual-tour { opacity: 1 }` (visualTour.scss) plus the
        // `--eccgui-visual-tour-focus-padding` custom property, now supplied inline since it also
        // feeds the `calc(...)` expressions the `backdropRef` callback above writes onto the
        // focushelper's `left`/`top`/`width`/`height`.
        <div
            className={cn(`${eccgui}-visual-tour`, "opacity-100")}
            style={{ "--eccgui-visual-tour-focus-padding": "7px" } as React.CSSProperties}
        >
            <div
                className={cn(
                    `${eccgui}-visual-tour__focushelper`,
                    // former `.eccgui-visual-tour__focushelper` rule: a border tracing the
                    // highlighted target, whose huge-spread box-shadow dims the rest of the page.
                    "absolute box-border rounded-[var(--eccgui-visual-tour-focus-padding)] border-2 border-ring",
                    "shadow-[0_0_0_10000px_color-mix(in_oklab,var(--foreground)_60%,transparent)]",
                )}
                style={{ zIndex: "var(--eccgui-zindex-modals, 8001)" as unknown as number }}
                ref={backdropRef}
            />
            <div>
                {/* former `.eccgui-visual-tour__backdrop` rule: `opacity: 0` even before the
                    restyle - this pane is intentionally invisible, the focushelper's box-shadow
                    above does the actual dimming. */}
                <div className={cn(`${eccgui}-visual-tour__backdrop`, "fixed inset-0 box-content opacity-0")} />
            </div>
            <DecoupledOverlay targetSelectorOrElement={highlightedElement} size={overlaySize} usePortal={false}>
                <Card isOnlyLayout elevation={-1} whitespaceAmount="small">
                    <CardHeader>
                        <CardTitle>{step.title}</CardTitle>
                        <CardOptions>{titleOption}</CardOptions>
                    </CardHeader>
                    {/* former `.eccgui-visual-tour__overlay__content .eccgui-card__content` rule
                        (visualTour.scss): cap the card content height in the (non-modal) popover
                        variant so an overly tall step doesn't grow the popover past the viewport. */}
                    <CardContent className="max-h-[45vh]">
                        <StepContent step={step} />
                    </CardContent>
                    <CardActions inverseDirection>{actionButtons}</CardActions>
                </Card>
            </DecoupledOverlay>
        </div>,
        document.body,
    );
};

export default VisualTour;
