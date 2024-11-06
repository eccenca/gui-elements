import React from "react";

import { ButtonReplacement } from "./Button";

/** @deprecated (v25) all legacy component support will be removed, switch to `<Button affirmative />` */
export function AffirmativeButtonReplacement({ children, ...otherProps }: any) {
    return (
        <ButtonReplacement {...otherProps} affirmative={true}>
            {children}
        </ButtonReplacement>
    );
}
