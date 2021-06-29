/*
    We need to replicate some elements from react flow because they

    1. do not export all sub elements, e.g. edges
    2. we need to add additional features for better usage
*/

import { EdgeDefault } from "./EdgeDefault";
import { EdgeStep } from "./EdgeStep";

export const edgeTypes = {
    default: EdgeDefault,
    straight: EdgeDefault,
    step: EdgeStep,
    smoothstep: EdgeStep,
};
