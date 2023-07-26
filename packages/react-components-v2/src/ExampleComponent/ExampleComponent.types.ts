// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ComponentProps, Slot } from '@fluentui/react-utilities';

/** @private */
export type ExampleComponentSlots = {
  /** Root of the component that renders as either a `<button>` tag or an `<a>` tag. */
  root: NonNullable<Slot<'div'>>;
};

/** @private */
export type ExampleComponentProps = ComponentProps<ExampleComponentSlots> & {
  exampleProp?: string;
};
