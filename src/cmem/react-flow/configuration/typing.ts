/** node types for linking editor nodes  */
export enum LINKING_NODE_TYPES {
    default = "default",
    sourcepath = "sourcepath",
    targetpath = "targetpath",
    transformation = "transformation",
    comparator = "comparator",
    aggregator = "aggregator",
    stickynote = "stickynote",
}

/** node types for workflow editor nodes */
export enum WORKFLOW_NODE_TYPES {
    default = "default",
    dataset = "dataset",
    linking = "linking",
    transform = "transform",
    task = "task",
    workflow = "workflow",
    stickynote = "stickynote",
}

/** node types for graph editor */
export enum GRAPH_NODE_TYPES {
    default = "default",
    graph = "graph",
    class = "class",
    instance = "instance",
    property = "property",
}
