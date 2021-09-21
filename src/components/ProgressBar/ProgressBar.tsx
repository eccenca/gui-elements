import { ProgressBar as BluePrintProgressBar } from "@blueprintjs/core";
import React from 'react';
import {ProgressBarProps} from "@blueprintjs/core/src/components/progress-bar/progressBar";

interface IProps extends ProgressBarProps {
}

/** Displays a progress bar. */
export function ProgressBar(props: IProps) {
    return <BluePrintProgressBar {...props} />
}
