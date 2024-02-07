import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { Table, TableBody, TableCell, TableContainer, TableRow } from "../../../index";

export default {
    title: "Components/Table/TableCell",
    component: TableCell,
    argTypes: {},
} as Meta<typeof TableCell>;

const Template: StoryFn<typeof TableCell> = (args) => {
    return (
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell {...args} />
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const Default = Template.bind({});
Default.args = {
    children: loremIpsum({ p: 1, avgSentencesPerParagraph: 1, avgWordsPerSentence: 4, random: false }).toString(),
};
