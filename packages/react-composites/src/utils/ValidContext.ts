// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';

/**
 * Generic function to ensure the retreived context is valid.
 * Returns the context or throws an error if the context is undefined.
 */
export const useValidContext = <T extends unknown>(ReactContext: React.Context<T | undefined>): T => {
  const context = useContext<T | undefined>(ReactContext);
  if (context === undefined) {
    throw new CommunicationUiError({
      message: 'Context is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return context;
};
