import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Button from "../Button/Button";
import { SimpleDialog } from "../Dialog";

export interface VisualTourProps {
    /** The CSS query of the container element that contains the feature that will be given a tour of.
     * If element highlighting is enabled, this will grey out every other element in the container element.
     * Default: body*/
    containerElementQuery?: string;
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

interface VisualTourStep {
    /** (Short) Title of the current step. */
    title: string;
    /** The description or more elaborate content element that is shown in the modal/overlay. */
    content: string | (() => React.JSX.Element);
    /** Optional element that should be highlighted, every other element in the container element is greyed out. */
    highlightElementQuery?: string;
}

const containerHighlightClass = `${eccgui}-visual-tour__container`;
const highlightElementClass = `${eccgui}-visual-tour__highlighted-element`;

/** A visual tour multi-step tour of the current view. */
export const VisualTour = ({
    containerElementQuery = "body",
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
        const element = document.querySelector(containerElementQuery);
        let elementToHighlight: Element | null = null;
        if (element) {
            // Remove previous element highlight
            element.classList.remove(containerHighlightClass);
            document.querySelector(`.${highlightElementClass}`)?.classList.remove(highlightElementClass);
            if (step.highlightElementQuery) {
                elementToHighlight = document.querySelector(step.highlightElementQuery);
                if (elementToHighlight) {
                    element.classList.add(containerHighlightClass);
                    elementToHighlight.classList.add(highlightElementClass);
                }
            }
        }
        const titleSuffix = ` ${currentStepIndex + 1} / ${steps.length}`;
        const navigationButtons = [
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
                    navigationButtons={navigationButtons}
                    step={step}
                    onClose={onClose}
                />
            );
        } else {
            setCurrentStepComponent(
                <StepModal
                    titleSuffix={titleSuffix}
                    navigationButtons={navigationButtons}
                    step={step}
                    onClose={onClose}
                />
            );
        }
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
    navigationButtons: (React.JSX.Element | null)[];
}

/** Modal that is displayed for a step. */
const StepModal = ({ step, titleSuffix, onClose, navigationButtons }: StepModalProps) => {
    return (
        <SimpleDialog
            title={`${step.title} ${titleSuffix}`}
            isOpen={true}
            preventSimpleClosing={true}
            onClose={onClose}
            actions={navigationButtons}
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
    // Close the visual tour
    onClose: () => void;
    // The navigation buttons
    navigationButtons: (React.JSX.Element | null)[];
}

/** Popover that is displayed and points at the highlighted element. */
const StepPopover = ({ highlightedElement, step, titleSuffix, onClose, navigationButtons }: StepPopoverProps) => {
    // TODO: Show popover on highlighted element
    return (
        <SimpleDialog
            title={`${step.title} ${titleSuffix}`}
            isOpen={true}
            preventSimpleClosing={true}
            onClose={onClose}
            actions={navigationButtons}
        >
            {typeof step.content === "string" ? step.content : step.content()}
            {highlightedElement.tagName}
        </SimpleDialog>
    );
};

export default VisualTour;
