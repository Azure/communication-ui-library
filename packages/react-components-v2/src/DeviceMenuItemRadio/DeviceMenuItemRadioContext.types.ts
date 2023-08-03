// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Slot } from '@fluentui/react-utilities';
import type { DeviceDefinition } from './DeviceMenuItemRadio.types';

/** @private */
export interface DeviceMenuItemRadioContextValue {
  device: DeviceDefinition;
  icon?: Slot<'span'>;
}
