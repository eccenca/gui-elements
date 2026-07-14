import GridColumn, { GridColumnProps } from "@/components/atoms/Grid/GridColumn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export type WorkspaceMainProps = GridColumnProps;

export const WorkspaceMain = ({ children, className = "", ...restProps }: GridColumnProps) => {
    return (
        <GridColumn {...restProps} className={`${eccgui}-workspace__main ` + className}>
            {children}
        </GridColumn>
    );
};

export default WorkspaceMain;
