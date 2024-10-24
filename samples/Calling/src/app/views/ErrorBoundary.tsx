// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';

export class ErrorBoundary extends React.Component<{ children: JSX.Element }, { error: string }> {
  constructor(props: { children: JSX.Element }) {
    super(props);
    this.state = { error: '' };
  }

  componentDidCatch(error: Error) {
    this.setState({ error: `${error.name}: ${error.message}` });
  }

  render() {
    // const { error } = this.state;

    return <>{this.props.children}</>;
  }
}
