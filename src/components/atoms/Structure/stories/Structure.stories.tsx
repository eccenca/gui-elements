import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Section, SectionHeader, TitleMainsection, TitleSubsection } from "@/components";

export default {
    title: "Components/Structure",
    component: Section,
    subcomponents: {
        SectionHeader,
        TitleMainsection,
        TitleSubsection,
    },
} as Meta<typeof Section>;

/**
 * Demonstrates the typical nesting of `Section`/`SectionHeader` with the two title levels:
 * `TitleMainsection` for the outermost section and `TitleSubsection` for a section nested
 * within that.
 */
const TemplatePageStructure: StoryFn<typeof Section> = (args) => (
    <Section {...args}>
        <SectionHeader>
            <TitleMainsection>Main section title</TitleMainsection>
        </SectionHeader>
        <p>Main section content.</p>
        <Section>
            <SectionHeader>
                <TitleSubsection>Subsection title</TitleSubsection>
            </SectionHeader>
            <p>Subsection content.</p>
        </Section>
    </Section>
);

export const PageStructure = TemplatePageStructure.bind({});

const TemplateTitleSubsection: StoryFn<typeof TitleSubsection> = (args) => <TitleSubsection {...args} />;

export const TitleSubsectionExample = TemplateTitleSubsection.bind({});
TitleSubsectionExample.args = {
    children: "Example subsection title",
    useHtmlElement: "h3",
};
