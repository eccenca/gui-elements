import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
    Button,
    Icon,
    OverviewItem,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    Toolbar,
    ToolbarSection,
    VisualTourProps,
} from "../../../index";

import VisualTour from "./VisualTour";

export default {
    title: "Components/VisualTour",
    component: VisualTour,
    argTypes: {},
} as Meta<typeof VisualTour>;

const Template: StoryFn<typeof VisualTour> = (args: VisualTourProps) => {
    const [closed, setClosed] = React.useState<boolean>(true);

    return (
        <div style={{ minHeight: "600px", minWidth: "800px" }}>
            <Toolbar id={"tourContainer"}>
                <ToolbarSection id={"textSection"} canGrow={true}>
                    Some text
                </ToolbarSection>
                <ToolbarSection id={"buttonSection"}>
                    <Button id={"actionA"}>Action A</Button>
                    <Button id={"actionB"}>Action B</Button>
                    <Button id={"startTour"} intent={"primary"} onClick={() => setClosed(false)}>
                        Start tour!
                    </Button>
                </ToolbarSection>
            </Toolbar>
            <div id="actionC" style={{ margin: "1rem", padding: "1rem", border: "dotted 1px lightgray" }}>
                Some other element for the tour.
            </div>
            <div style={{ height: "100vh" }} />
            <div id="actionD" style={{ margin: "1rem", padding: "1rem", border: "dotted 1px lightgray" }}>
                Another element for the tour, not visible at first.
            </div>
            {!closed ? <VisualTour {...args} onClose={() => setClosed(true)} /> : null}
        </div>
    );
};

export const Default = Template.bind({});
const defaultArgs: VisualTourProps = {
    containerElementQuery: "#tourContainer",
    steps: [
        {
            title: "First step",
            content: "This is a demonstration of a visual tour. A step can be simple text.",
        },
        {
            title: "Custom content",
            content: () => (
                <OverviewItem>
                    <OverviewItemDepiction>
                        <Icon name={"item-info"} />
                    </OverviewItemDepiction>
                    <OverviewItemDescription>
                        <OverviewItemLine>
                            Or a step can be arbitrary content that is displayed in a modal by default.
                        </OverviewItemLine>
                        <OverviewItemLine>The developer can choose what's appropriate.</OverviewItemLine>
                    </OverviewItemDescription>
                </OverviewItem>
            ),
        },
        {
            title: "Highlight element A",
            content:
                "It's possible to highlight specific elements on a page. The step content is then displayed in a kind of tooltip instead of a modal.",
            highlightElementQuery: "#actionA",
        },
        {
            title: "Highlight element B",
            content: "Context overlay for another highlighted element.",
            highlightElementQuery: "#actionB",
        },
        {
            title: "Highlight element C",
            content: "Element outside tour container.",
            highlightElementQuery: "#actionC",
        },
        {
            title: "Highlight element D",
            content: "Element not visible at first.",
            highlightElementQuery: "#actionD",
        },
    ],
    onClose: () => {},
};
Default.args = defaultArgs;
