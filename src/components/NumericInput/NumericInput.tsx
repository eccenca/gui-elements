import { memo } from "react";
import { NumericInput as BlueprintNumericInput } from "@blueprintjs/core";

// @deprecated will be remove because beside the special arrow buttons it does not add any special. Could be done also with TextField + correct `type`.
export const NumericInput = memo(BlueprintNumericInput);
export default NumericInput;
