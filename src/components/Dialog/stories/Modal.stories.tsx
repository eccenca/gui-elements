import React from "react";
import { OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";

import { SimpleCard } from "../../Card/stories/Card.stories";
import { ModalContext, useModalContext } from "../ModalContext";

import { Button, Card, CardContent, CardHeader, CardTitle, Modal, Spacing } from "./../../../../index";

export default {
    title: "Components/Dialog/Modal",
    component: Modal,
    argTypes: {
        children: {
            control: false,
        },
    },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => (
    <OverlaysProvider>
        <div style={{ height: "400px" }}>
            <Modal {...args} />
        </div>
    </OverlaysProvider>
);

const ContextTemplate: StoryFn<typeof Modal> = (args) => {
    const { setModalOpen, openModalStack } = useModalContext();

    return (
        <ModalContext.Provider value={{ setModalOpen, openModalStack }}>
            <OverlaysProvider>
                <div style={{ height: "400px" }}>
                    <Modal {...args} />
                </div>
            </OverlaysProvider>
        </ModalContext.Provider>
    );
};

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />,
    onOpening: fn(),
    onClosing: fn(),
};

/** Nested modals with modal context for tracking open/close states. */
const InnerModal = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [portalElement, setPortalElement] = React.useState<HTMLElement | undefined>();

    React.useEffect(() => {
        setPortalElement(document.getElementById("modalPortal"));
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            usePortal={true}
            size={"tiny"}
            modalId={"innerModal"}
            portalContainer={portalElement}
            hasBackdrop={true}
        >
            Inner modal with constant modal ID "innerModal".
            <Spacing />
            <TrackingContent
                more={
                    <>
                        <Spacing key={"spacing"} />
                        <Button key={"close"} onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </>
                }
            />
        </Modal>
    );
};

const MiddleModal = () => {
    const [portalElement, setPortalElement] = React.useState<HTMLElement | undefined>();

    React.useEffect(() => {
        setPortalElement(document.getElementById("modalPortal"));
    }, []);

    return (
        <Modal
            isOpen={true}
            modalId={"middleModal"}
            size={"small"}
            usePortal={true}
            portalContainer={portalElement}
            hasBackdrop={true}
        >
            Middle modal with constant modal ID "middleModal".
            <Spacing />
            <TrackingContent more={<InnerModal />} />
        </Modal>
    );
};

/** Shows the current stack of open modals. */
const TrackingContent = ({ more }: { more: React.JSX.Element }) => {
    const modalContext = React.useContext(ModalContext);

    return (
        <Card>
            <CardHeader key="1">
                <CardTitle>Tracking content</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {(modalContext.openModalStack ?? []).map((modalId, idx) => (
                        <li key={modalId}>
                            {idx + 1}. {modalId}
                        </li>
                    ))}
                </ul>
                {more}
            </CardContent>
        </Card>
    );
};

export const NestedModalWithContext = ContextTemplate.bind({});
NestedModalWithContext.args = {
    ...Default.args,
    size: "regular",
    usePortal: false,
    children: [
        <div id={"modalPortal"}>
            Root modal with automatically generated unique modal ID.
            <Spacing />
            <MiddleModal />
        </div>,
    ],
};
