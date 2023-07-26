// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ComponentProps, Slot } from '@fluentui/react-utilities';

/** @private */
export type ExampleComponentSlots = {
  root: NonNullable<Slot<'div'>>;
};

/** @private */
export type ExampleComponentProps = ComponentProps<ExampleComponentSlots> & {
  exampleProp?: string;
};
