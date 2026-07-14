// import PropTypes from 'prop-types';
import Grid, { GridProps } from "@/components/atoms/Grid/Grid";
import GridRow from "@/components/atoms/Grid/GridRow";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export type WorkspaceContentProps = GridProps;

export const WorkspaceContent = ({ children, className = "", ...restProps }: WorkspaceContentProps) => {
    return (
        <Grid {...restProps} as={"article"} className={`${eccgui}-workspace__content ` + className}>
            <GridRow dontWrapColumns={false}>{children}</GridRow>
        </Grid>
    );
};

export default WorkspaceContent;
