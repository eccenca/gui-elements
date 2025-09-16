import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
    Button,
    Icon,
    OverflowText,
    OverviewItem,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    Toolbar,
    ToolbarSection,
    VisualTour,
    VisualTourProps,
} from "../../../../index";

import stepDefinitionsEn from "./defaultTour";
import stepDefinitionsDe from "./defaultTour.de";

export default {
    title: "Components/VisualTour",
    component: VisualTour,
    argTypes: {},
} as Meta<typeof VisualTour>;

const Template: StoryFn<typeof VisualTour> = (args: VisualTourProps) => {
    const [isOpen, setIsOpen] = React.useState<boolean | undefined>();

    return (
        <div style={{ minHeight: "600px", minWidth: "800px" }}>
            <Toolbar id={"tourContainer"}>
                <ToolbarSection canGrow={true}>
                    <span id={"textSection"}>Some text</span>
                </ToolbarSection>
                <ToolbarSection id={"buttonSection"}>
                    <Button id={"actionA"}>Action A</Button>
                    <Button id={"actionB"}>Action B</Button>
                    <Button id={"startTour"} intent={"primary"} onClick={() => setIsOpen(true)}>
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
            <VisualTour
                {...args}
                onClose={() => setIsOpen(false)}
                dontStartAutomatically={typeof isOpen !== "undefined" ? !isOpen : args.dontStartAutomatically}
            />
        </div>
    );
};

// Randomly choose between English and German translation
// FIXME: we cannot use random situation, otherwise the storybook example cannot relly compared between revisions
const stepDefinitions = Math.random() < 0.5 ? stepDefinitionsEn : stepDefinitionsDe;

export const Default = Template.bind({});
const defaultArgs: VisualTourProps = {
    steps: [
        {
            ...stepDefinitions.firstStep,
        },
        {
            ...stepDefinitions.customContent,
            content: () => {
                const texts = stepDefinitions.customContent.texts;
                return (
                    <OverviewItem>
                        <OverviewItemDepiction>
                            <Icon name={"item-info"} />
                        </OverviewItemDepiction>
                        <OverviewItemDescription>
                            <OverviewItemLine>
                                <OverflowText>{texts.firstLine}</OverflowText>
                            </OverviewItemLine>
                            <OverviewItemLine>
                                <OverflowText>{texts.secondLine}</OverflowText>
                            </OverviewItemLine>
                        </OverviewItemDescription>
                    </OverviewItem>
                );
            },
        },
        {
            ...stepDefinitions.highlightElementA,
            highlightElementQuery: "#actionA",
        },
        {
            ...stepDefinitions.highlightElementB,
            highlightElementQuery: "#actionB",
        },
        {
            ...stepDefinitions.highlightElementLeft,
            highlightElementQuery: "#textSection",
        },
        {
            ...stepDefinitions.highlightElementC,
            highlightElementQuery: "#actionC",
        },
        {
            ...stepDefinitions.highlightElementD,
            highlightElementQuery: "#actionD",
        },
    ],
    onClose: () => {},
    dontStartAutomatically: true,
};
Default.args = defaultArgs;
