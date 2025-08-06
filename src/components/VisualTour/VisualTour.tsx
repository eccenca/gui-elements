import React from "react";
import { createPopper } from "@popperjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Button from "../Button/Button";
import { Card, CardActions, CardContent, CardHeader, CardTitle } from "../Card";
import { SimpleDialog } from "../Dialog";

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
    /** Optional element that should be highlighted, every other element in the container element is greyed out. */
    highlightElementQuery?: string;
    /** The texts used in the step, e.g. when custom layouts are rendered, these will be used for the text strings. */
    texts?: Record<string, string>;
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
        const elementToHighlight = !!step.highlightElementQuery && document.querySelector(step.highlightElementQuery);
        if (elementToHighlight) {
            elementToHighlight.classList.add(highlightElementClass);
            elementToHighlight.scrollIntoView();
        }
        const titleSuffix = ` ${currentStepIndex + 1} / ${steps.length}`;
        const actionButtons = [
            <Button onClick={onClose}>{closeLabel}</Button>,
            hasNextStep ? (
                <Button
                    onClick={() => {
                        setCurrentStepIndex(currentStepIndex + 1);
                    }}
                >
                    {nextLabel}: {steps[currentStepIndex + 1].title}
                </Button>
            ) : null,
            hasPreviousStep ? (
                <Button
                    onClick={() => {
                        setCurrentStepIndex(currentStepIndex - 1);
                    }}
                >
                    {prevLabel}: {steps[currentStepIndex - 1].title}
                </Button>
            ) : null,
        ];
        // TODO: What to do if an element should have been highlighted, but none was found?
        if (elementToHighlight) {
            setCurrentStepComponent(
                <StepPopover
                    highlightedElement={elementToHighlight}
                    titleSuffix={titleSuffix}
                    actionButtons={actionButtons}
                    step={step}
                />
            );
        } else {
            setCurrentStepComponent(
                <StepModal titleSuffix={titleSuffix} actionButtons={actionButtons} step={step} onClose={onClose} />
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
    titleSuffix: string;
    // Close the visual tour
    onClose: () => void;
    // The navigation buttons
    actionButtons: (React.JSX.Element | null)[];
}

/** Modal that is displayed for a step. */
const StepModal = ({ step, titleSuffix, onClose, actionButtons }: StepModalProps) => {
    return (
        <SimpleDialog
            title={`${step.title} ${titleSuffix}`}
            isOpen={true}
            preventSimpleClosing={true}
            onClose={onClose}
            actions={actionButtons}
        >
            {typeof step.content === "string" ? step.content : step.content()}
        </SimpleDialog>
    );
};

interface StepPopoverProps {
    highlightedElement: Element;
    step: VisualTourStep;
    // Current step starting with 1
    titleSuffix: string;
    // The navigation buttons
    actionButtons: (React.JSX.Element | null)[];
}

/** Popover that is displayed and points at the highlighted element. */
const StepPopover = ({ highlightedElement, step, titleSuffix, actionButtons }: StepPopoverProps) => {
    const tooltipRef = React.useCallback(
        (tooltip: HTMLDivElement | null) => {
            if (tooltip) {
                createPopper(highlightedElement, tooltip, {
                    placement: "auto",
                });
            }
        },
        [highlightedElement]
    );

    return (
        <div className={`${eccgui}-tooltip__content` + ` ${eccgui}-tooltip--large`} role="tooltip" ref={tooltipRef}>
            <Card>
                <CardHeader>
                    <CardTitle>{`${step.title} ${titleSuffix}`}</CardTitle>
                </CardHeader>
                <CardContent>{typeof step.content === "string" ? step.content : step.content()}</CardContent>
                <CardActions>{actionButtons}</CardActions>
            </Card>
        </div>
    );
};

export default VisualTour;
