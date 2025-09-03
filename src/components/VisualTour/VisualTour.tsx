import React from "react";
import { createPortal } from "react-dom";
import { Classes as BlueprintClasses } from "@blueprintjs/core";
import { createPopper } from "@popperjs/core";

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
}

/** This should be used for defining steps in a separate object/file. Use with 'satisfies' after the object definition. */
export type VisualTourStepDefinitions = Record<string, Partial<VisualTourStep>>;

const highlightElementClass = `${eccgui}-visual-tour__highlighted-element`;

/** A visual tour multi-step tour of the current view. */
export const VisualTour = ({
    steps,
    onClose,
    closeLabel = "Close",
    nextLabel = "Next",
    prevLabel = "Back",
}: VisualTourProps) => {
    const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
    const [currentStepComponent, setCurrentStepComponent] = React.useState<React.JSX.Element | null>(null);

    React.useEffect(() => {
        const step = steps[currentStepIndex];
        if (!step) {
            // This should not happen
            setCurrentStepComponent(null);
            onClose();
            return;
        }
        const hasNextStep = currentStepIndex + 1 < steps.length;
        const hasPreviousStep = currentStepIndex > 0;
        // Configure optional highlighting
        let elementToHighlight: HTMLElement | null = null;
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
        }
        if (elementToHighlight) {
            // Typescript for some reason incorrectly infers the type of elementToHighlight as never
            (elementToHighlight as HTMLElement).classList.add(highlightElementClass);
            (elementToHighlight as HTMLElement).scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
        const stepDisplay = (
            <Badge tagProps={{ emphasis: "weaker" }} size="large">
                {` ${currentStepIndex + 1}/${steps.length} `}
            </Badge>
        );
        const closeButton = <IconButton name="navigation-close" text={closeLabel} onClick={onClose} />;
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
                    intent={"primary"}
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
                    onClick={onClose}
                    variant="outlined"
                    intent={"primary"}
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
                />
            );
        } else {
            setCurrentStepComponent(
                <StepModal titleOption={titleOptions} actionButtons={actionButtons} step={step} onClose={onClose} />
            );
        }
        return () => {
            // Remove previous element highlight
            document.querySelector(`.${highlightElementClass}`)?.classList.remove(highlightElementClass);
        };
    }, [currentStepIndex]);

    return currentStepComponent;
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
                    <img
                        src={step.image}
                        style={{ height: "auto", width: "auto", maxHeight: "30vh", maxWidth: "100%" }}
                    />
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
            size={step.size === "medium" ? "regular" : step.size ?? "regular"}
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
    const tooltipRef = React.useCallback(
        (tooltip: HTMLDivElement | null) => {
            if (tooltip) {
                createPopper(highlightedElement, tooltip, {
                    placement: "auto",
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, 15],
                            },
                        },
                    ],
                });
            }
        },
        [highlightedElement]
    );

    const backdropRef = React.useCallback(
        (backdrop: HTMLDivElement | null) => {
            if (backdrop) {
                const targetRect = highlightedElement.getBoundingClientRect();
                backdrop.style.left = `calc(${
                    targetRect.left + window.scrollX + "px"
                } - var(--${eccgui}-visual-tour-focus-padding))`;
                backdrop.style.top = `calc(${
                    targetRect.top + window.scrollY + "px"
                } - var(--${eccgui}-visual-tour-focus-padding))`;
                backdrop.style.width = `calc(${
                    targetRect.width + "px"
                } + 2 * var(--${eccgui}-visual-tour-focus-padding))`;
                backdrop.style.height = `calc(${
                    targetRect.height + "px"
                } + 2 * var(--${eccgui}-visual-tour-focus-padding))`;
            }
        },
        [highlightedElement]
    );

    return createPortal(
        <div className={`${eccgui}-visual-tour`}>
            <div className={`${eccgui}-visual-tour__focushelper`} ref={backdropRef} />
            <div>
                <div className={`${eccgui}-visual-tour__backdrop`} />
            </div>
            <div
                className={
                    `${eccgui}-visual-tour__overlay` +
                    ` ${eccgui}-visual-tour__overlay--${step.size ?? "large"}` +
                    ` ${BlueprintClasses.POPOVER}`
                }
                role="tooltip"
                ref={tooltipRef}
            >
                <div
                    className={`${eccgui}-visual-tour__arrow ${BlueprintClasses.POPOVER_ARROW}`}
                    data-popper-arrow
                    aria-hidden
                />
                <div className={BlueprintClasses.POPOVER_CONTENT}>
                    <Card isOnlyLayout elevation={-1} whitespaceAmount="small">
                        <CardHeader>
                            <CardTitle>{step.title}</CardTitle>
                            <CardOptions>{titleOption}</CardOptions>
                        </CardHeader>
                        <CardContent>
                            <StepContent step={step} />
                        </CardContent>
                        <CardActions inverseDirection>{actionButtons}</CardActions>
                    </Card>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VisualTour;
