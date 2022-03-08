import { EdgeDefault } from "./../../../extensions/react-flow/edges/EdgeDefault";
import { NodeDefault } from "./../../../extensions/react-flow/nodes/NodeDefault";

export const edgeTypes = {
    default: EdgeDefault,
    implicitEdge: EdgeDefault,
    importEdge: EdgeDefault,
    subclassEdge: EdgeDefault,
    subpropertyEdge: EdgeDefault,
    rdftypeEdge: EdgeDefault,
    successStep: EdgeDefault,
    warningStep: EdgeDefault,
    dangerStep: EdgeDefault,
};

export const nodeTypes = {
    default: NodeDefault,
    graphNode: NodeDefault,
    classNode: NodeDefault,
    instanceNode: NodeDefault,
    propertyNode: NodeDefault,
};
