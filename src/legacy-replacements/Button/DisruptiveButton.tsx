import React from "react";

import { ButtonReplacement } from "./Button";

export function DisruptiveButtonReplacement({ children, ...otherProps }: any) {
    return (
        <ButtonReplacement {...otherProps} disruptive={true}>
            {children}
        </ButtonReplacement>
    );
}
