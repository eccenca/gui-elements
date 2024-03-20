import React from "react";

// import PropTypes from 'prop-types';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import Grid, { GridProps } from "./../Grid/Grid";
import GridRow from "./../Grid/GridRow";

export type WorkspaceContentProps = GridProps;

export const WorkspaceContent = ({ children, className = "", ...restProps }: WorkspaceContentProps) => {
    return (
        <Grid {...restProps} as={"article"} className={`${eccgui}-workspace__content ` + className} fullWidth={true}>
            <GridRow dontWrapColumns={false}>{children}</GridRow>
        </Grid>
    );
};

export default WorkspaceContent;
