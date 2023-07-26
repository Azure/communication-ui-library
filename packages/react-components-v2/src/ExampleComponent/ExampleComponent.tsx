// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ExampleComponentProps } from './ExampleComponent.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

/**
 * Example component that can be used as template for a new component.
 * *
 * @remarks
 * Update this doc comment with relevant information about the component and its usage and make
 * sure to update the display name to match the component name. You will likely also want to
 * change `@internal` below to `@public`.
 *
 * @internal
 */
export const ExampleComponent: ForwardRefComponent<ExampleComponentProps> = React.forwardRef((props, ref) => {
  return (
    <div {...props} ref={ref}>
      Example Component
    </div>
  );
});

ExampleComponent.displayName = 'ExampleComponent';
