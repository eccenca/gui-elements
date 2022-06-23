import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import {
    PopoverPosition,
    PopoverInteractionKind,
    PopperModifiers,
} from "@blueprintjs/core";
import {
    PlacementOptions
} from "@blueprintjs/popover2";

import {
  ContextOverlay,
  HtmlContentBlock,
  Button
} from "../../index";

export default {
  title: "Components/ContextOverlay",
  component: ContextOverlay,
  argTypes: {
      className: {
          control: "string",
          description: "A space-delimited list of class names to pass along to a child element."
      },
      defaultIsOpen: {
          control: "boolean",
          description: "Initial opened state when uncontrolled."
      },
      isOpen: {
          control: "boolean",
          description: "Whether the popover is visible. Passing this prop puts the popover in controlled mode, where the only way to change visibility is by updating this property."
      },
      interactionKind: {
          control: "select",
          options: {UNDEFINED: undefined, ...PopoverInteractionKind},
          description: "The kind of interaction that triggers the display of the popover."
      },
      canEscapeKeyClose: {
          control: "boolean",
          description: "Whether pressing the esc key should invoke `onClose`."
      },
      onClose: {
          control: "none",
          description: "A callback that is invoked when user interaction causes the overlay to close, such as clicking on the overlay or pressing the esc key (if enabled).",
          table: {
              defaultValue: { summary: undefined },
              type: { summary: "(event: SyntheticEvent<HTMLElement>) => void" },
          }
      },
      onInteraction: {
          control: "none",
          description: "Callback invoked in controlled mode when the popover open state would change due to user interaction.",
          table: {
              defaultValue: { summary: undefined },
              type: { summary: "(nextOpenState: boolean, e?: React.SyntheticEvent<HTMLElement>) => void" },
          }
      },
      children: {
          control: "none",
      },
      content: {
          control: "none",
          description: "Elements for overlay content."
      },
      minimal: {
          control: "boolean",
          description: "Whether to apply minimal styling to this popover or tooltip. Minimal popovers do not have an arrow pointing to their target and use a subtler animation."
      },
      placement: {
          control: "select",
          options: PlacementOptions,
          description: "The placement (relative to the target) at which the popover should appear. Mutually exclusive with `position` prop."
      },
      /*
      position: {
          control: "select",
          options: {UNDEFINED: undefined, ...PopoverPosition},
          description: "The position (relative to the target) at which the popover should appear. Mutually exclusive with `placement` prop."
      },
      */
      usePortal: {
          control: "boolean",
          description: "Whether the popover should be rendered inside a Portal attached to `portalContainer` prop."
      },
      modifiers: {
          control: "object",
          description: "Popper modifier options, passed directly to internal Popper instance. See https://popper.js.org/docs/v2/modifiers/ for complete details.",
          table: {
              defaultValue: { summary: undefined },
              type: { summary: "PopperModifiers" },
          }
      },
      hasBackdrop: {
          control: "boolean",
          description: "Enables an invisible overlay beneath the popover that captures clicks and prevents interaction with the rest of the document until the popover is closed, only available with `PopoverInteractionKind.CLICK`."
      },
      rootBoundary: {
          control: "select",
          options: {UNDEFINED: undefined, VIEWPORT: "viewport", DOCUMENT: "document"},
          description: "A root boundary element supplied to the `flip` and `preventOverflow` modifiers, shorthand for overriding Popper.js modifier options. See: https://popper.js.org/docs/v2/utils/detect-overflow/#rootboundary",
          table: {
              defaultValue: { summary: "viewport" },
              type: { summary: "RootBoundary" },
          }
      },
      positioningStrategy: {
          control: "select",
          options: {UNDEFINED: undefined, ABSOLUTE: "absolute", FIXED: "fixed"},
          description: "Popper.js positioning strategy. See: https://popper.js.org/docs/v2/constructors/#strategy",
          table: {
              defaultValue: { summary: "absolute" },
              type: { summary: "PositioningStrategy" },
          }
      },
  },
} as ComponentMeta<typeof ContextOverlay>;

const Template: ComponentStory<typeof ContextOverlay> = (args) => (
    <ContextOverlay {...args} />
);

export const Default = Template.bind({});
Default.args = {
    children: <Button>Target</Button>,
    content: (
        <HtmlContentBlock style={{maxWidth: "40em", padding: "0.5rem"}}>
            Overlay:
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
    //position: PopoverPosition.RIGHT,
    placement: "auto-start",
    usePortal: true,
    minimal: false,
    defaultIsOpen: false,
    modifiers: {
        flip: {
            enabled: true
        },
        preventOverflow: {
            enabled: true,
        }
    } as PopperModifiers,
    rootBoundary: "viewport",
    hasBackdrop: false,
}
