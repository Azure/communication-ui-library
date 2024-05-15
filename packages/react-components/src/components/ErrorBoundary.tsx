// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * @internal
 * ErrorBoundary component to handle errors in React components.
 */
export class _ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // handle error
      return this.props.fallback;
    }
    // otherwise render children
    return this.props.children;
  }
}
