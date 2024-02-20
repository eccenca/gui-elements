import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { AlertDialog, ApplicationContainer } from "./../../../../index";
import { Default as SimpleDialogExample } from "./SimpleDialog.stories";

export default {
    title: "Components/Dialog/AlertDialog",
    component: AlertDialog,
    argTypes: {
        headerOptions: { table: { disable: true } },
        children: { table: { disable: true } },
        actions: { table: { disable: true } },
        hasBorder: { table: { disable: true } },
        isOpen: { table: { disable: true } },
        usePortal: { table: { disable: true } },
        notifications: { table: { disable: true } },
        preventSimpleClosing: { table: { disable: true } },
        intent: { table: { disable: true } },
        overlayClassName: { table: { disable: true } },
        preventBackdrop: { table: { disable: true } },
    },
} as Meta<typeof AlertDialog>;

const Template: StoryFn<typeof AlertDialog> = (args) => (
    <ApplicationContainer>
        <div style={{ height: "400px" }}>
            <AlertDialog {...args} />
        </div>
    </ApplicationContainer>
);

export const Default = Template.bind({});
Default.args = {
    ...SimpleDialogExample.args,
    title: "AlertDialog example title",
    size: "small",
    hasBorder: false,
    headerOptions: [],
    actions: SimpleDialogExample.args.actions.slice(0, 2),
    success: false,
    warning: true,
    danger: false,
};
