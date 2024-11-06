import React from "react";

import { ButtonReplacement } from "./Button";

/** @deprecated (v25) all legacy component support will be removed, switch to `<Button disruptive />` */
export function DisruptiveButtonReplacement({ children, ...otherProps }: any) {
    return (
        <ButtonReplacement {...otherProps} disruptive={true}>
            {children}
        </ButtonReplacement>
    );
}
