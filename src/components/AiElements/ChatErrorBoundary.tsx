import React, { Component, type ReactNode } from "react";

export interface ChatErrorBoundaryProps {
    /** Identifies the guarded region in the console error (e.g. a message id). */
    label: string;
    children: ReactNode;
    /**
     * Custom fallback for a crashed subtree. Defaults to a compact English
     * error strip; pass a render function to localize or restyle it.
     */
    renderFallback?: (error: Error) => ReactNode;
}

type State = { error: Error | null };

/**
 * A render crash inside a chat message (e.g. a malformed tool part) otherwise
 * tears down the whole conversation silently. Catch it per-boundary, log the
 * full error + component stack to the console, and show a visible fallback so
 * the chat keeps working and the failure is never invisible.
 */
export class ChatErrorBoundary extends Component<ChatErrorBoundaryProps, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: { componentStack?: string | null }) {
        console.error(`[chat] render crash in ${this.props.label}:`, error, info?.componentStack);
    }

    render() {
        if (this.state.error) {
            if (this.props.renderFallback) {
                return this.props.renderFallback(this.state.error);
            }
            return (
                <div className="my-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    Failed to render this message ({this.state.error.message}). See the console for details.
                </div>
            );
        }
        return this.props.children;
    }
}
