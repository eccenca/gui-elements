import React, { CSSProperties } from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import {
    ApplicationContainer,
    ApplicationContent,
    ApplicationHeader,
    ApplicationSidebarNavigation,
    ApplicationSidebarToggler,
    ApplicationTitle,
    ApplicationToolbar,
    ApplicationToolbarAction,
    ApplicationToolbarPanel,
    ApplicationToolbarSection,
    Badge,
    Button,
    Depiction,
    Icon,
    OverviewItem,
    WorkspaceHeader,
} from "../../../index";

interface ApplicationBasicExampleProps {
    openMainNavigation: boolean;
    openUserMenu: boolean;
    countNotifications: number;
    colorBackgroundHeader?: string;
}

function ApplicationBasicExample(args: ApplicationBasicExampleProps) {
    return args ? <></> : <></>;
}

export default {
    title: "Components/Application/Elements",
    component: ApplicationBasicExample,
    subcomponents: {
        ApplicationContainer,
        ApplicationContent,
        ApplicationHeader,
        ApplicationTitle,
        ApplicationSidebarToggler,
        ApplicationSidebarNavigation,
        ApplicationToolbar,
        ApplicationToolbarSection,
        ApplicationToolbarAction,
    },
    argTypes: {
        colorBackgroundHeader: {
            control: { type: "color" },
        },
    },
} as Meta<typeof ApplicationBasicExample>;

const TemplateBasicExample: StoryFn<typeof ApplicationBasicExample> = (args) => (
    <ApplicationContainer>
        <ApplicationHeader
            aria-label={"Application"}
            style={
                args.colorBackgroundHeader
                    ? ({ "--eccgui-appheader-color-background": args.colorBackgroundHeader } as CSSProperties)
                    : undefined
            }
        >
            <ApplicationTitle
                isNotDisplayed={!args.openMainNavigation}
                isApplicationSidebarExpanded={args.openMainNavigation}
            >
                ApplicationName
            </ApplicationTitle>
            <ApplicationSidebarToggler
                aria-label={args.openMainNavigation ? "Close navigation" : "Open navigation"}
                isActive={args.openMainNavigation}
            />
            <ApplicationSidebarNavigation isRail={!args.openMainNavigation} expanded={args.openMainNavigation}>
                <code>Menu</code> with <code>MenuItem</code>s.
            </ApplicationSidebarNavigation>

            <WorkspaceHeader id={"ApplicationBasicExample"}>
                <OverviewItem>
                    <Depiction
                        image={<Icon name={"application-homepage"} />}
                        backgroundColor={"dark"}
                        padding="medium"
                        ratio="1:1"
                    />
                </OverviewItem>
            </WorkspaceHeader>

            <ApplicationToolbar>
                <ApplicationToolbarSection>
                    <Button>Action</Button>
                </ApplicationToolbarSection>
                {args.countNotifications && (
                    <ApplicationToolbarAction aria-label="Open notifications menu" isActive={false}>
                        <Depiction
                            padding="medium"
                            size="small"
                            ratio="1:1"
                            resizing="contain"
                            image={<Icon name="application-notification" title="Notification menu icon" large />}
                            badge={
                                <Badge
                                    position={"top-right"}
                                    intent="warning"
                                    maxLength={2}
                                    children={args.countNotifications}
                                />
                            }
                        />
                    </ApplicationToolbarAction>
                )}
                {args.openUserMenu ? (
                    <>
                        <ApplicationToolbarAction aria-label={"Close user menu"} tooltipAlignment="end" isActive={true}>
                            <Icon name="navigation-close" title="Close icon" large />
                        </ApplicationToolbarAction>
                        <ApplicationToolbarPanel aria-label="User menu" expanded={true}>
                            <code>Menu</code> with <code>MenuItem</code>s.
                        </ApplicationToolbarPanel>
                    </>
                ) : (
                    <ApplicationToolbarAction
                        id={"headerUserMenu"}
                        aria-label={"Open user menu"}
                        tooltipAlignment="end"
                        isActive={false}
                    >
                        <Icon name="application-useraccount" title="User menu icon" large />
                    </ApplicationToolbarAction>
                )}
            </ApplicationToolbar>
        </ApplicationHeader>
        <ApplicationContent
            isApplicationSidebarExpanded={args.openMainNavigation}
            isApplicationSidebarRail={!args.openMainNavigation}
        >
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </ApplicationContent>
    </ApplicationContainer>
);

export const BasicExample = TemplateBasicExample.bind({});
BasicExample.args = {
    openMainNavigation: false,
    openUserMenu: false,
    countNotifications: 234,
};
