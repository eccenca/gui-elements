import { ProgressBar as BluePrintProgressBar } from "@blueprintjs/core";
import React from 'react';
import {IProgressBarProps} from "@blueprintjs/core/lib/esm/components/progress-bar/progressBar";

interface IProps extends IProgressBarProps {

}

export function ProgressBar(props: IProps) {
    return <BluePrintProgressBar {...props} />
}
