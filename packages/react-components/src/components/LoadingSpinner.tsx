// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Spinner } from '@fluentui/react';
import React from 'react';
import { loadingSpinnerContainerStyle } from './styles/LoadingSpinner.style';

const spinnerStyles = {
  circle: {
    height: '5rem',
    width: '5rem',
    borderWidth: '0.25em'
  }
};

/**
 * @public
 */
export const LoadingSpinner = (): JSX.Element => {
  return (
    <div className={loadingSpinnerContainerStyle()}>
      <Spinner styles={spinnerStyles} ariaLive="polite" />
    </div>
  );
};
