// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { DeviceDefinition } from './DeviceMenuItemRadio.types';

/** @private */
export interface DeviceMenuGroupContextValue {
  radioGroupName: string;
  selectedDeviceId: string;
  onDeviceSelected: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, device: DeviceDefinition) => void;
}
