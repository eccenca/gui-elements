import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { HtmlContentBlock, Section, TitleMainsection, WorkspaceContent, WorkspaceMain } from "@/components";

export default {
    title: "Components/Workspace",
    component: WorkspaceContent,
    subcomponents: { WorkspaceMain },
} as Meta<typeof WorkspaceContent>;

/**
 * `WorkspaceContent` provides the grid for a workspace view; `WorkspaceMain` is the grid
 * column holding the main content of the view.
 */
const Template: StoryFn<typeof WorkspaceContent> = (args) => (
    <WorkspaceContent {...args}>
        <WorkspaceMain>
            <Section>
                <TitleMainsection>Main section</TitleMainsection>
                <HtmlContentBlock>
                    <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
                </HtmlContentBlock>
            </Section>
        </WorkspaceMain>
    </WorkspaceContent>
);

export const Default = Template.bind({});
Default.args = {};
