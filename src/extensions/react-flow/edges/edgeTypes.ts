/*
    We need to replicate some elements from react flow because they

    1. do not export all sub elements, e.g. edges
    2. we need to add additional features for better usage
*/

import { EdgeDefault } from "./EdgeDefault";
import { EdgeStep } from "./EdgeStep";

// @deprecated will be removed because it is probably not used this way anymore
export const edgeTypes = {
    default: EdgeDefault,
    straight: EdgeDefault,
    step: EdgeStep,

    success: EdgeDefault,
    warning: EdgeDefault,
    danger: EdgeDefault,

    implicit: EdgeDefault,
    import: EdgeDefault,
    subclass: EdgeDefault,
    subproperty: EdgeDefault,
    rdftype: EdgeDefault,

    value: EdgeStep,
    score: EdgeStep,
};
