// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUiErrorFromError, CommunicationUiError } from '../types/CommunicationUiError';
import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorHandlingProps, useTriggerOnErrorCallback } from '../providers/ErrorProvider';

const ErrorBoundary = class extends React.Component<ErrorHandlingProps> {
  constructor(props: ErrorHandlingProps) {
    super(props);
  }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (error instanceof CommunicationUiError) {
      const uiError = CommunicationUiErrorFromError(error);
      uiError.errorInfo = info;
      this.props.onErrorCallback?.(uiError);
    } else {
      this.props.onErrorCallback?.(new CommunicationUiError({ error: error, errorInfo: info }));
    }
  }
  render(): ReactNode {
    return <>{this.props.children}</>;
  }
};

/**
 * Wraps a given component with error handling. Wrapping a component does two things:
 *
 * 1. Surrounds the given component with a component that implements React Error Boundary (componentDidCatch) to allow
 *    us to handle errors detected by React.
 * 2. Adds ErrorProvider's triggerOnErrorCallback as a prop to the wrapped component if ErrorProvider is defined. If
 *    ErrorProvider is not defined, then the original props.onErrorCallback is the passed into the component.
 *
 * This support the two cases:
 *
 * 1. Connected Component. The wrapper subscribes to ErrorProvider and will pass ErrorProvider's triggerOnErrorCallback
 *    to the wrapped component.
 * 2. Pure Standalone Component. The wrapper takes in an optional props.onErrorCallback. Since ErrorProvider is not
 *    defined, the passed in props.onErrorCallback will be used.
 */
export const WithErrorHandling = (
  Component: (props: any & ErrorHandlingProps) => JSX.Element,
  props: any & ErrorHandlingProps
): JSX.Element => {
  try {
    const triggerOnErrorCallback = useTriggerOnErrorCallback();
    const newProps = { ...props };
    newProps.onErrorCallback = triggerOnErrorCallback;
    return (
      <ErrorBoundary onErrorCallback={triggerOnErrorCallback}>
        <Component {...newProps} />
      </ErrorBoundary>
    );
  } catch (error) {
    return (
      <ErrorBoundary onErrorCallback={props.onErrorCallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  }
};
