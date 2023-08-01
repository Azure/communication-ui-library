// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import type { ComponentProps, Slot } from '@fluentui/react-utilities';

/**
 * Available slots in the {@link _FileCardGroupProps}.
 *
 * @internal
 */
export type _FileCardGroupSlots = {
  root: NonNullable<Slot<'div'>>;
};

/**
 * @internal
 * Props for `_FileCardGroup` component.
 */
export type _FileCardGroupProps = ComponentProps<_FileCardGroupSlots> & {
  children: React.ReactNode;
  ariaLabel?: string;
};
