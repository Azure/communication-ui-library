// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';

// Add the custom HTML tag to the JSX.IntrinsicElements interface
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'msft-mention': React.HTMLAttributes<'msft-mention'> & {
        id?: string;
        displayText?: string;
      };
    }
  }
}
