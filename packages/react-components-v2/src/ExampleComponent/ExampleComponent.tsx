// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ExampleComponentProps } from './ExampleComponent.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

/** @public */
export const ExampleComponent: ForwardRefComponent<ExampleComponentProps> = React.forwardRef((props, ref) => {
  return (
    <div {...props} ref={ref}>
      Example Component
    </div>
  );
});

ExampleComponent.displayName = 'ExampleComponent';
