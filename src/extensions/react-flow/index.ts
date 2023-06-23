import { miniMapUtils } from "./minimap/utils";
import { nodeDefaultUtils } from "./nodes/nodeUtils";

export * from "./nodes/NodeDefault";
export * from "./nodes/NodeContent";
export * from "./nodes/NodeContentExtension";
export * from "./nodes/NodeTools";
export * from "./nodes/nodeUtils";
export * from "./handles/HandleDefault";
export * from "./edges/EdgeDefault";
export * from "./edges/EdgeStep";
export * from "./edges/EdgeTools";
export * from "./edges/EdgeLabel";
export * from "./markers/ReactFlowMarkers";
export * from "./minimap/MiniMap";
export * from "./minimap/utils";

// deprecated exports
export { nodeTypes } from "./nodes/nodeTypes"; // FIXME: deprecated, remove it later
export { edgeTypes } from "./edges/edgeTypes"; // FIXME: deprecated, remove it later
// @deprecated was moved to `miniMapUtils.nodeClassName`
const minimapNodeClassName = miniMapUtils.nodeClassName;
// @deprecated was moved to `miniMapUtils.nodeClassName`
const minimapNodeColor = miniMapUtils.nodeColor;
export { minimapNodeClassName, minimapNodeColor };
// @deprecated renamed to `nodeDefaultUtils`
const nodeUtils = nodeDefaultUtils;
export { nodeUtils };
