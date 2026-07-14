
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import GridColumn, { GridColumnProps } from "@/components/atoms/Grid/GridColumn";

export type WorkspaceSideProps = GridColumnProps;

export const WorkspaceSide = ({ children, className = "", ...restProps }: GridColumnProps) => {
    return (
        <GridColumn
            {...restProps}
            className={`${eccgui}-workspace__side ` + className}
            sizeConfig={{ sm: 4, md: 8, lg: 5, xlg: 5 }}
        >
            {children}
        </GridColumn>
    );
};

export default WorkspaceSide;
