import React from "react";
import { Classes, OverlaysProvider } from "@blueprintjs/core";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";

import { SimpleCard } from "../../Card/stories/Card.stories";

import {
    Button,
    Card,
    CardContent,
    Modal,
    ModalContext,
    ModalSize,
    Spacing,
    useModalContext,
} from "./../../../../index";

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

export const Default = Template.bind({});
Default.args = {
    isOpen: true,
    usePortal: false,
    children: <Card {...SimpleCard.args} />,
    onOpening: fn(),
    onClosing: fn(),
};

const ContextTemplate = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
    const { setModalOpen, openModalStack } = useModalContext();

    return (
        <OverlaysProvider>
            <div style={{ height: "70vh", position: "relative" }} id={"modalPortal"}>
                <ModalContext.Provider value={{ setModalOpen, openModalStack }}>{children}</ModalContext.Provider>
            </div>
        </OverlaysProvider>
    );
};

const ModalContent = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <Card style={{ height: "100%" }}>
            <CardContent>{children}</CardContent>
        </Card>
    );
};

/** Component for nested modals. */
const ExampleModal = ({
    id,
    size,
    children,
}: {
    id?: string;
    size: ModalSize;
    children?: React.HTMLAttributes<HTMLDivElement>["children"];
}) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [portalElement, setPortalElement] = React.useState<HTMLElement | undefined>();

    React.useEffect(() => {
        setPortalElement(document.getElementById("modalPortal")!);
    }, []);

    return (
        <Modal
            modalId={id}
            size={size}
            isOpen={isOpen}
            usePortal={true}
            portalContainer={portalElement}
            hasBackdrop={true}
            onOpened={() => {
                // workaround, Blueprint attach a class to body tht prevents scrolling, probably it is attached to the wrong portal
                document.body.classList.remove(Classes.OVERLAY_OPEN);
            }}
        >
            <ModalContent>
                Modal with constant modal ID "{id}".
                <Spacing />
                <TrackingContent />
                <Spacing />
                {children}
                <Spacing />
                <Button key={"close"} onClick={() => setIsOpen(false)}>
                    Close
                </Button>
            </ModalContent>
        </Modal>
    );
};

const InnerModal = () => {
    return <ExampleModal id="innerModal" size="small" />;
};

const MiddleModal = () => {
    return (
        <ExampleModal id="middleModal" size="regular">
            <InnerModal />
        </ExampleModal>
    );
};

/** Shows the current stack of open modals. */
const TrackingContent = () => {
    const modalContext = React.useContext(ModalContext);

    return (
        <ul>
            {(modalContext.openModalStack() ?? []).map((modalId, idx) => (
                <li key={modalId}>
                    {idx + 1}. {modalId}
                </li>
            ))}
        </ul>
    );
};

/**
 * `ModalContext` can be used as provider to track a stack of modals.
 *
 * ```(Javascript)
 * const ContextTemplate = () => {
 *     const { setModalOpen, openModalStack } = useModalContext();
 *     return (
 *         <ModalContext.Provider value={{ setModalOpen, openModalStack }}>
 *             <SimpleDialog size="large" isOpen>
 *                 <OtherModal />
 *             </SimpleDialog>
 *         </ModalContext.Provider>
 *     );
 * };
 *
 * const OtherModal = () => {
 *     const modalContext = React.useContext(ModalContext);
 *     return (
 *         <SimpleDialog size="small">
 *            <ul>
 *                {(modalContext.openModalStack ?? []).map((modalId, idx) => (
 *                    <li key={modalId}>
 *                        {idx + 1}. {modalId}
 *                    </li>
 *                ))}
 *            </ul>
 *         </SimpleDialog>
 *     );
 * };
 * ```
 */
export const NestedModalWithContext = ContextTemplate.bind({});
NestedModalWithContext.args = {
    children: [
        <ExampleModal id="rootModal" size="large">
            <MiddleModal />
        </ExampleModal>,
    ],
};
