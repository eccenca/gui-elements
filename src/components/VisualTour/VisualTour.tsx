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
    /** The label for the next button. */
    nextLabel?: string;
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
        // Configure optional highlighting
        const element = document.querySelector(containerElementQuery);
        if (element) {
            // Remove previous element highlight
            element.classList.remove(containerHighlightClass);
            document.querySelector(`.${highlightElementClass}`)?.classList.remove(highlightElementClass);
            if (step.highlightElementQuery) {
                const elementToHighlight = document.querySelector(step.highlightElementQuery);
                if (elementToHighlight) {
                    element.classList.add(containerHighlightClass);
                    elementToHighlight.classList.add(highlightElementClass);
                }
            }
        }
        setCurrentStepComponent(
            <SimpleDialog
                title={step.title + ` ${currentStepIndex + 1} / ${steps.length}`}
                isOpen={true}
                preventSimpleClosing={true}
                onClose={onClose}
                actions={[
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
                ]}
            >
                {typeof step.content === "string" ? step.content : step.content()}
            </SimpleDialog>
        );
    }, [currentStepIndex]);

    return currentStepComponent;
};

export default VisualTour;
