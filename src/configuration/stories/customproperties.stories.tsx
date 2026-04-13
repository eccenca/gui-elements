import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import CssCustomProperties from "../../common/utils/CssCustomProperties";
import {
    Section,
    SectionHeader,
    Spacing,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TitleSubsection,
} from "../../components";
import { CLASSPREFIX as eccgui } from "../../index";

const groups: { title: string; filterName: (name: string) => boolean }[] = [
    {
        title: "Typography",
        filterName: (name) => name.startsWith(`--${eccgui}-size-typo`),
    },
    {
        title: "Font weights and spacing",
        filterName: (name) => name.startsWith(`--${eccgui}-font`),
    },
    {
        title: "Whitespace",
        filterName: (name) => name.startsWith(`--${eccgui}-size-block`) || name.startsWith(`--${eccgui}-size-inline`),
    },
    {
        title: "Color aliases",
        filterName: (name) => name.startsWith(`--${eccgui}-color`) && !name.startsWith(`--${eccgui}-color-palette`),
    },
    {
        title: "Accessibility",
        filterName: (name) => name.startsWith(`--${eccgui}-a11y`),
    },
    {
        title: "Opacity",
        filterName: (name) => name.startsWith(`--${eccgui}-opacity`),
    },
    {
        title: "Palette colors",
        filterName: (name) => name.startsWith(`--${eccgui}-color-palette`),
    },
];

const CssCustomPropertiesOverview = () => {
    return (
        <>
            {groups.map(({ title, filterName }) => {
                const properties = new CssCustomProperties({
                    selectorText: ":root",
                    filterName,
                    removeDashPrefix: false,
                    returnObject: false,
                }).customProperties() as string[][];

                return (
                    <React.Fragment key={title}>
                        <Section>
                            <SectionHeader>
                                <TitleSubsection>{title}</TitleSubsection>
                            </SectionHeader>
                            <Spacing size="tiny" />
                            <TableContainer>
                                <Table columnWidths={["60%", "40%"]}>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>CSS custom property</TableHeader>
                                            <TableHeader>Current value</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {properties.map(([name, value]) => (
                                            <TableRow key={name}>
                                                <TableCell>
                                                    <code>{name}</code>
                                                </TableCell>
                                                <TableCell>
                                                    {name.startsWith(`--${eccgui}-color`) && (
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                width: `var(--${eccgui}-size-block-whitespace)`,
                                                                height: `var(--${eccgui}-size-block-whitespace)`,
                                                                backgroundColor: value,
                                                                verticalAlign: "middle",
                                                                marginRight: `var(--${eccgui}-size-inline-whitespace)`,
                                                                border: "1px solid currentColor",
                                                            }}
                                                        />
                                                    )}
                                                    <code>{value}</code>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Section>
                        <Spacing size="large" />
                    </React.Fragment>
                );
            })}
        </>
    );
};

/**
 * We mirror our SCSS configuration variables as CSS custom vars.
 * This way they can be easily used for inline styles or in CSS modules without SCSS includes.
 */
export default {
    title: "Configuration/CSS Custom Properties",
    component: CssCustomPropertiesOverview,
} as Meta<typeof CssCustomPropertiesOverview>;

export const Default: StoryFn = () => <CssCustomPropertiesOverview />;
