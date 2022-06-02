// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Spinner } from '@fluentui/react';
import React from 'react';
import { loadingSpinnerContainerStyle } from './styles/LoadingSpinner.style';

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoadingSpinnerProps {}

const spinnerStyles = {
  circle: {
    height: '100px',
    width: '100px',
    borderWidth: '5px'
  },
  label: {
    fontSize: '12px'
  }
};

/**
 * @public
 */
export const LoadingSpinner = (): JSX.Element => {
  return (
    <div className={loadingSpinnerContainerStyle()}>
      <Spinner styles={spinnerStyles} label={''} ariaLive="assertive" labelPosition="top" />
    </div>
  );
};
