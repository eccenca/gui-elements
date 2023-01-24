import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Badge, Depiction, Icon } from "../../../index";
import canonicalIcons from "./../../Icon/canonicalIconNames";
import png16to9 from "./test-16to9.png";
import png9to16 from "./test-9to16.png";
import svg16to9 from "./test-16to9.svg";
import svg9to16 from "./test-9to16.svg";
import svg16to9base64 from "./test-16to9.tobase64.svg";
import svg9to16base64 from "./test-9to16.tobase64.svg";
import { Svg16to9 } from "./test-16to9";
import { Svg9to16 } from "./test-9to16";

const allIcons = new Map([
    ...Object.keys(canonicalIcons).map((keyId) => { return [`Icon: ${keyId}`, <Icon name={keyId} />] })
]);

const exampleImages = {
    "PNG 16:9 as URL": <img src={png16to9} />,
    "PNG 9:16 as URL": <img src={png9to16} />,
    "SVG 16:9 as URL": <img src={svg16to9} />,
    "SVG 9:16 as URL": <img src={svg9to16} />,
    "SVG 16:9 as Base64": <img src={svg16to9base64} />,
    "SVG 9:16 as Base64": <img src={svg9to16base64} />,
    "SVG 16:9 as React element": <Svg16to9 />,
    "SVG 9:16 as React element": <Svg9to16 />,
    // "PNG 16:9 as Base64": <img src={`${base64Reader.result}`} />,
    // "SVG 16:9 as Base64": <img src={`${base64Reader.result}`} />,
    ...Object.fromEntries(allIcons),
};

const exampleBadges = {
    "No badge": undefined,
    "Text badge (small, danger, bottom-right)": <Badge maxLength={5} intent="danger" position="bottom-right" size="small">Problem occured!</Badge>,
    "Icon badge (accent, inline, bottom-right)": <Badge intent="info" position="bottom-right"><Icon name="application-useraccount" /></Badge>,
    "Number badge (large, info, top-right)": <Badge maxLength={2} intent="info" position="top-right" size="large" children={123} />,
}

export default {
    title: "Components/Depiction",
    component: Depiction,
    argTypes: {
        image: {
            control: "select",
            options: Object.keys(exampleImages),
            mapping: exampleImages,
        },
        backgroundColor: {
            control: "color",
        },
        badge: {
            control: "select",
            options: Object.keys(exampleBadges),
            mapping: exampleBadges,
        },
    },
} as ComponentMeta<typeof Depiction>;

const TemplateFull: ComponentStory<typeof Depiction> = (args) => (
    <Depiction {...args} />
);

export const FullExample = TemplateFull.bind({});
FullExample.args = {
    image: <img src={png16to9} />,
    caption: "This is a test description for the image."
};
