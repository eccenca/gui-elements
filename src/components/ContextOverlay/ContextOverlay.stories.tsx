import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';
import { PopoverPosition, PopoverInteractionKind, PopperModifiers } from "@blueprintjs/core"

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
      children: {
          control: "none",
          description: "Can be used to set `target` (first child) and `content` (other children) in an alternate way."
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
          options: {UNDEFINED: undefined, ...PopoverPosition},
          description: "The placement (relative to the target) at which the popover should appear. Mutually exclusive with `position` prop."
      },
      position: {
          control: "select",
          options: {UNDEFINED: undefined, ...PopoverPosition},
          description: "The position (relative to the target) at which the popover should appear. Mutually exclusive with `placement` prop."
      },
      target: {
          control: "none",
          description: "Element to use as toggler for the overlay display."
      },
      usePortal: {
          control: "boolean",
          description: "Whether the popover should be rendered inside a Portal attached to `portalContainer` prop."
      },
      modifiers: {
          control: "object",
          description: "Popper modifier options, passed directly to internal Popper instance. See https://popper.js.org/docs/v1/#modifiers--codeobjectcode for complete details.",
          table: {
              defaultValue: { summary: undefined },
              type: { summary: "PopperModifiers" },
          }
      },
      hasBackdrop: {
          control: "boolean",
          description: "Enables an invisible overlay beneath the popover that captures clicks and prevents interaction with the rest of the document until the popover is closed, only available with `PopoverInteractionKind.CLICK`."
      },
  },
} as ComponentMeta<typeof ContextOverlay>;

const Template: ComponentStory<typeof ContextOverlay> = (args) => (
    <ContextOverlay {...args} />
);

export const Default = Template.bind({});
Default.args = {
    target: <Button>Target</Button>,
    content: (
        <HtmlContentBlock style={{maxWidth: "40em", padding: "0.5rem"}}>
            Overlay:
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    ),
    position: PopoverPosition.RIGHT,
    usePortal: true,
    minimal: false,
    defaultIsOpen: false,
    modifiers: {
        flip: {
            enabled: true,
            //behavior: ["flip", "clockwise", "counterclockwise"],
            boundariesElement: 'viewport',
            padding: 1
        },
        preventOverflow: {
            enabled: false,
            boundariesElement: 'viewport'
        }
    } as PopperModifiers,
    hasBackdrop: false,
}
