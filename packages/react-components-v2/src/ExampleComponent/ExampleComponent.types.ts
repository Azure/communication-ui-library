// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ComponentProps, Slot } from '@fluentui/react-utilities';

/**
 * Available slots in the {@link ExampleComponent}.
 *
 * @internal
 */
export type ExampleComponentSlots = {
  root: NonNullable<Slot<'div'>>;
};

/**
 * Props of the {@link ExampleComponent}.
 *
 * @internal
 */
export type ExampleComponentProps = ComponentProps<ExampleComponentSlots> & {
  exampleProp?: string;
};
