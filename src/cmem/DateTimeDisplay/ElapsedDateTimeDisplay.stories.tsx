import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { ElapsedDateTimeDisplay, ElapsedDateTimeDisplayUnits } from "./ElapsedDateTimeDisplay";

const translateUnits = (unit: ElapsedDateTimeDisplayUnits) => unit;

export default {
    title: "cmem/ElapsedDateTimeDisplay",
    component: ElapsedDateTimeDisplay,
    args: {
        translateUnits,
    },
} as Meta<typeof ElapsedDateTimeDisplay>;

const Template: StoryFn<typeof ElapsedDateTimeDisplay> = (args) => <ElapsedDateTimeDisplay {...args} />;

/** Roughly two hours ago, rendered relative to "now". */
export const Default = Template.bind({});
Default.args = {
    dateTime: Date.now() - 2 * 60 * 60 * 1000,
    prefix: "updated ",
    suffix: " ago",
};

/** Below one minute collapses to the "< 1 minute" hint. */
export const JustNow = Template.bind({});
JustNow.args = {
    dateTime: Date.now() - 5 * 1000,
};
