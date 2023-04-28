// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IRawStyle } from '@fluentui/react';

/**
 * ComponentSlotStyle is a \@fluentui/react-northstar type.
 * As we have moved away from this package we have used the more generic IRawStyle type from fluent for interoperability.
 *
 * @public
 */
export type ComponentSlotStyle = Omit<IRawStyle, 'animation'>;
