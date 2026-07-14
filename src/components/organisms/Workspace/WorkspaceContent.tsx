
// import PropTypes from 'prop-types';
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import Grid, { GridProps } from "@/components/atoms/Grid/Grid";
import GridRow from "@/components/atoms/Grid/GridRow";

export type WorkspaceContentProps = GridProps;

export const WorkspaceContent = ({ children, className = "", ...restProps }: WorkspaceContentProps) => {
    return (
        <Grid {...restProps} as={"article"} className={`${eccgui}-workspace__content ` + className}>
            <GridRow dontWrapColumns={false}>{children}</GridRow>
        </Grid>
    );
};

export default WorkspaceContent;
