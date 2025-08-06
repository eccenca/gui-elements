import { VisualTourStepDefinitions } from "../VisualTour";

const definition = {
    firstStep: {
        title: "First step",
        content: "This is a demonstration of a visual tour. A step can be simple text.",
    },
    customContent: {
        title: "Custom content",
        texts: {
            firstLine: "Or a step can be arbitrary content that is displayed in a modal by default.",
            secondLine: "The developer can choose what's appropriate.",
        },
    },
    highlightElementA: {
        title: "Highlight element A",
        content:
            "It's possible to highlight specific elements on a page. The step content is then displayed in a kind of tooltip instead of a modal.",
    },
    highlightElementB: {
        title: "Highlight element B",
        content: "Context overlay for another highlighted element.",
    },
    highlightElementC: {
        title: "Highlight element C",
        content: "Element outside tour container.",
    },
    highlightElementD: {
        title: "Highlight element D",
        content: "Element not visible at first.",
    },
} satisfies VisualTourStepDefinitions;

export default definition;
