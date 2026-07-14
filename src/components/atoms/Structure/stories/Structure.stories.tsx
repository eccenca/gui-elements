import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Section, SectionHeader, TitleMainsection, TitlePage, TitleSubsection } from "@/components";

export default {
    title: "Components/Structure",
    component: Section,
    subcomponents: {
        SectionHeader,
        TitlePage,
        TitleMainsection,
        TitleSubsection,
    },
} as Meta<typeof Section>;

/**
 * Demonstrates the typical nesting of `Section`/`SectionHeader` with the three title levels:
 * `TitlePage` for the outermost section, `TitleMainsection` for a nested section and
 * `TitleSubsection` for a section nested within that.
 */
const TemplatePageStructure: StoryFn<typeof Section> = (args) => (
    <Section {...args}>
        <SectionHeader>
            <TitlePage>Page title</TitlePage>
        </SectionHeader>
        <Section>
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
    </Section>
);

export const PageStructure = TemplatePageStructure.bind({});

const TemplateTitleSubsection: StoryFn<typeof TitleSubsection> = (args) => <TitleSubsection {...args} />;

export const TitleSubsectionExample = TemplateTitleSubsection.bind({});
TitleSubsectionExample.args = {
    children: "Example subsection title",
    useHtmlElement: "h3",
};
