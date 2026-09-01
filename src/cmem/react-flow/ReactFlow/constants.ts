/*
    Classes that when set for an element, prevent that they trigger react-flow dragging, wheel and panning actions.

    This module must stay free of imports, so that basic components can use these class names without pulling the
    react-flow packages into their dependency chain.
*/
export const preventReactFlowDragClass = "nodrag";
export const preventReactFlowPanClass = "nopan";
export const preventReactFlowWheelClass = "nowheel";
export const preventReactFlowActionsClasses = `${preventReactFlowDragClass} ${preventReactFlowPanClass} ${preventReactFlowWheelClass}`;

export const helperClasses = {
    preventDrag: preventReactFlowDragClass,
    preventPan: preventReactFlowPanClass,
    preventWheel: preventReactFlowWheelClass,
    preventAllActions: preventReactFlowActionsClasses,
};
