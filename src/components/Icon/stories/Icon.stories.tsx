import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";

import {
    Card,
    FlexibleLayoutContainer,
    FlexibleLayoutItem,
    Icon,
    OverflowText,
    OverviewItem,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    TitleSubsection,
} from "../../../../index";
import { Definitions } from "../../../common/Intent";
import BaseIcon from "../BaseIcon";

import canonicalIcons, { ValidIconName } from "./../canonicalIconNames";

export default {
    title: "Components/Icon",
    component: Icon,
    subcomponents: { BaseIcon },
    argTypes: {
        name: {
            control: "select",
            options: [...Object.keys(canonicalIcons)],
        },
        intent: {
            control: "select",
            options: [...Object.keys(Definitions)],
            mapping: { ...Definitions },
        },
    },
} as Meta<typeof Icon>;

const Template: StoryFn<typeof Icon> = (args) => (
    <OverlaysProvider>
        <Icon tooltipText={args.name?.toString()} {...args} />
    </OverlaysProvider>
);

export const Default = Template.bind({});
Default.args = {
    name: "undefined",
    title: "This is the title",
};

const TemplateSizes: StoryFn<typeof Icon> = (args) => (
    <OverlaysProvider>
        <Icon {...args} small />
        <Icon {...args} />
        <Icon {...args} large />
    </OverlaysProvider>
);

export const IconSizes = TemplateSizes.bind({});
IconSizes.args = {
    name: "undefined",
};

/**
 * Available icons by their canonical names.
 * If you need another icon then use `<TestIcon /`> component.
 */
export const IconsOverview = () => {
    let section = "";
    let separation = <></>;
    return (
        <OverlaysProvider>
            <FlexibleLayoutContainer
                noEqualItemSpace
                gapSize="small"
                style={{ flexWrap: "wrap", justifyContent: "flex-start" }}
            >
                {Object.keys(canonicalIcons)
                    .sort()
                    .map((iconName) => {
                        if (
                            section !==
                            iconName.substring(0, iconName.indexOf("-") > 0 ? iconName.indexOf("-") : iconName.length)
                        ) {
                            section = iconName.substring(
                                0,
                                iconName.indexOf("-") > 0 ? iconName.indexOf("-") : iconName.length
                            );
                            separation = (
                                <FlexibleLayoutItem style={{ width: "100%", padding: "1rem 0 0.5rem 0" }}>
                                    <TitleSubsection>{section}</TitleSubsection>
                                </FlexibleLayoutItem>
                            );
                        } else {
                            separation = <></>;
                        }
                        return (
                            <React.Fragment key={iconName}>
                                {separation}
                                <FlexibleLayoutItem growFactor={0} style={{ width: "20rem" }}>
                                    <Card>
                                        <OverviewItem>
                                            <OverviewItemDepiction keepColors>
                                                <Icon name={iconName as ValidIconName} />
                                            </OverviewItemDepiction>
                                            <OverviewItemDescription>
                                                <OverviewItemLine small>
                                                    <OverflowText>{iconName}</OverflowText>
                                                </OverviewItemLine>
                                            </OverviewItemDescription>
                                        </OverviewItem>
                                    </Card>
                                </FlexibleLayoutItem>
                            </React.Fragment>
                        );
                    })}
            </FlexibleLayoutContainer>
        </OverlaysProvider>
    );
};
