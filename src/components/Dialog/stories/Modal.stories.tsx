import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Modal from "./../Modal";
import Card from "../../Card/Card";
import { SimpleCard } from "../../Card/stories/Card.stories";

export default {
    title: "Components/Dialog/Modal",
    component: Modal,
    argTypes: {
        autoFocus: {
            description: "Modal acquires application focus when it first opens.",
            control: "boolean",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            }
        },
        canEscapeKeyClose: {
            description: "Pressing the `esc` key triggers `onClose` handler.",
            control: "boolean",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            }
        },
        canOutsideClickClose: {
            description: "Clicking outside the modal triggers `onClose` handler.",
            control: "boolean",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            }
        },
        enforceFocus: {
            description: "Prevent focus from leaving modal element. If an element outside the modal is focused then the modal will immediately bring focus back to itself. If you are nesting modal components, either disable this prop on the outermost modal or mark the nested ones `usePortal={false}`.",
            control: "boolean",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            }
        },
        isOpen: {
            description: "Toggles the visibility of the overlay and its children, this prop is required because the component is controlled",
        },
        onClose: {
            description: "A callback that is invoked when user interaction causes the modal to close.",
            table: {
                type: { summary: "(event: SyntheticEvent<HTMLElement>) => void" },
                defaultValue: { summary: undefined },
            }
        },
        shouldReturnFocusOnClose: {
            description: "Return focus to the last active element in the document after modal closes.",
            control: "boolean",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            }
        },
        usePortal: {
            description: "Whether the modal should be wrapped in a Portal, which renders its contents in a new element attached to `portalContainer` prop, by default to `document.body`.",
            control: "boolean",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            }
        },
        children: {
            control: "none",
            description: "Elements to include into the modal container."
        }
    },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => (
    <div style={{height: "400px"}}>
        <Modal {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />
};
