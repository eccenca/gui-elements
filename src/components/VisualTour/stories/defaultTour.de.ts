import { VisualTourStepDefinitions } from "../VisualTour";

const definition = {
    firstStep: {
        title: "Erter Schritt",
        content: "Dies ist eine Demonstration einer Visuellen Tour. Ein Schritt kann aus einfachen Text bestehen.",
    },
    customContent: {
        title: "Benutzerspezifizierter Inhalt",
        texts: {
            firstLine: "Ein Schritt kann aber auch beliebigen Inhalt anbieten, der in einem Dialog angezeigt wird.",
            secondLine: "Der Entwickler kann bestimmen wie etwas angezeigt werden soll.",
        },
    },
    highlightElementA: {
        title: "Element A hervorheben",
        content:
            "Es ist möglich spezifische Elemente auf der Seite hervorzuheben. Der Inhalt des Schrittes ist dann als eine Art Tooltip um das Element herum dargestellt.",
    },
    highlightElementB: {
        title: "Element B hervorheben",
        content: "Kontextoverlay für ein anderes hervorgehobenes Element.",
    },
    highlightElementLeft: {
        title: "Element auf der linken Seite hervorheben",
        content: "Der Tooltip wird dort plaziert, wo er am besten für den Benutzer zu sehen ist.",
    },
    highlightElementC: {
        title: "Element C hervorheben",
        content: "Element ist außerhalb des Tourcontainers.",
    },
    highlightElementD: {
        title: "Element D hervorheben",
        content: "Element ist nucht sichtbar am Anfang.",
    },
} satisfies VisualTourStepDefinitions;

export default definition;
